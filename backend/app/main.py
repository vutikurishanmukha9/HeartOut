"""
FastAPI Application - HeartOut Backend
Modern async API with SQLAlchemy 2.0 and Pydantic v2
"""
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import auth, posts, admin


# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - startup and shutdown events"""
    # Startup
    print("Starting FastAPI application...")
    
    # Create tables if they don't exist (for both SQLite and PostgreSQL)
    # In production, you might want to use Alembic migrations instead
    from app.models.models import (
        User, Post, Comment, Support, Bookmark, ReadProgress, TokenBlocklist
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print(f"Database tables verified/created")
    
    print(f"Using database: {settings.DATABASE_URL[:30]}...")
    yield
    
    # Shutdown
    print("Shutting down FastAPI application...")
    await engine.dispose()


# Create FastAPI app
app = FastAPI(
    title="HeartOut API",
    description="Personal Storytelling Platform - FastAPI Backend",
    version="3.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# Add rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# Custom exception handler - convert FastAPI 'detail' to Flask-style 'error' for frontend compatibility
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Convert FastAPI error responses to Flask-compatible format"""
    error_content = exc.detail
    
    # If detail is already a dict with 'error' key, use it as-is
    if isinstance(error_content, dict) and 'error' in error_content:
        return JSONResponse(
            status_code=exc.status_code,
            content=error_content
        )
    
    # Convert string detail to 'error' key format for Flask compatibility
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": error_content if isinstance(error_content, str) else str(error_content)}
    )


# Validation error handler - properly serialize Pydantic v2 errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors - convert to JSON-serializable format"""
    errors = []
    for error in exc.errors():
        # Convert error to JSON-serializable format
        serializable_error = {
            "type": error.get("type", "validation_error"),
            "loc": error.get("loc", []),
            "msg": str(error.get("msg", "Validation error")),
        }
        # Only include 'input' if it's serializable
        if "input" in error and isinstance(error["input"], (str, int, float, bool, type(None), list, dict)):
            serializable_error["input"] = error["input"]
        errors.append(serializable_error)
    
    return JSONResponse(
        status_code=422,
        content={"detail": errors}
    )
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://heartout.vercel.app",
        "https://heart-out.vercel.app",
        "https://heartout-kx89.onrender.com",
    ],
    allow_origin_regex=r"https://.*\.onrender\.com|https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Security headers middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    if not settings.DEBUG:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# Include routers - use /api/ prefix to match Flask routes for frontend compatibility
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(posts.router, prefix="/api/posts", tags=["Stories"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


# Health check endpoint
@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy", "message": "FastAPI server is running!"}


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API info"""
    return {
        "name": "HeartOut API",
        "version": "3.0.0",
        "framework": "FastAPI",
        "docs": "/api/docs"
    }


# WebSocket endpoint for real-time notifications
from fastapi import WebSocket, WebSocketDisconnect, Query
from app.api.v1.websockets import manager
from app.core.security import decode_token
from app.core.database import async_session_maker
from sqlalchemy import select


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket, 
    token: str = Query(None, description="JWT access token")
):
    """WebSocket endpoint for real-time notifications with JWT authentication"""
    # Validate token
    if not token:
        await websocket.close(code=4001, reason="Authentication required")
        return
    
    payload = decode_token(token)
    if not payload:
        await websocket.close(code=4001, reason="Invalid token")
        return
    
    # Get user from database to verify they exist
    user_public_id = payload.get("sub")
    if not user_public_id:
        await websocket.close(code=4001, reason="Invalid token payload")
        return
    
    # Check token is not revoked
    jti = payload.get("jti")
    async with async_session_maker() as db:
        from app.models.models import User, TokenBlocklist
        
        if jti:
            blocklist_result = await db.execute(
                select(TokenBlocklist).where(TokenBlocklist.jti == jti)
            )
            if blocklist_result.scalar_one_or_none():
                await websocket.close(code=4001, reason="Token revoked")
                return
        
        # Get user
        result = await db.execute(
            select(User).where(User.public_id == user_public_id)
        )
        user = result.scalar_one_or_none()
        
        if not user or not user.is_active:
            await websocket.close(code=4001, reason="User not found")
            return
        
        user_id = user.id
    
    # Connection authenticated - proceed
    await manager.connect(websocket, user_id)
    try:
        while True:
            # Keep connection alive, handle incoming messages
            data = await websocket.receive_json()
            
            # Handle different message types
            if data.get("type") == "join_story":
                story_id = data.get("story_id")
                if story_id:
                    manager.add_reader(story_id, user_id)
                    await manager.broadcast_reader_count(story_id)
            
            elif data.get("type") == "leave_story":
                story_id = data.get("story_id")
                if story_id:
                    manager.remove_reader(story_id, user_id)
                    await manager.broadcast_reader_count(story_id)
            
            elif data.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
    
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception:
        manager.disconnect(user_id)

