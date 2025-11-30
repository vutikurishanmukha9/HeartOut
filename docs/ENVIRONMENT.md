# Environment Variables Configuration

## Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

### Required Variables

```env
# Flask Configuration
FLASK_APP=run.py
FLASK_ENV=development  # Use 'production' in production
SECRET_KEY=your-super-secret-key-change-this-in-production

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/heartout
# For SQLite (development): DATABASE_URL=sqlite:///heartout.db

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRES=3600  # 1 hour in seconds
JWT_REFRESH_TOKEN_EXPIRES=2592000  # 30 days in seconds

# Redis (for rate limiting and caching)
REDIS_URL=redis://localhost:6379/0

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Server Configuration
PORT=5000
```

### Optional Variables

```env
# Email Configuration (for future features)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Logging
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL

# Rate Limiting
RATELIMIT_STORAGE_URL=redis://localhost:6379/1
```

### Production Considerations

For production environments:

1. **Generate Strong Secrets**:
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

2. **Use Environment-Specific URLs**:
   - Use managed database services (AWS RDS, Heroku Postgres, etc.)
   - Use managed Redis (Redis Cloud, AWS ElastiCache, etc.)

3. **Security**:
   - Never commit `.env` files to version control
   - Use environment variable management tools (AWS Secrets Manager, HashiCorp Vault, etc.)
   - Enable HTTPS in production

---

## Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

### Required Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=HeartOut
VITE_APP_DESCRIPTION=Share your authentic stories
```

### Optional Variables

```env
# Analytics (for future integration)
VITE_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X

# Feature Flags
VITE_ENABLE_COMMENTS=true
VITE_ENABLE_REACTIONS=true
VITE_ENABLE_SHARING=true

# Environment
VITE_ENV=development  # development, staging, production
```

### Production Configuration

For production builds:

```env
VITE_API_BASE_URL=https://api.heartout.com/api
VITE_ENV=production
```

---

## Docker Environment Variables

When using Docker Compose, create a `.env` file in the root directory:

```env
# Database
POSTGRES_USER=heartout
POSTGRES_PASSWORD=secure-password-here
POSTGRES_DB=heartout

# Redis
REDIS_PASSWORD=redis-password-here

# Backend
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

# Ports
BACKEND_PORT=5000
FRONTEND_PORT=3000
POSTGRES_PORT=5432
REDIS_PORT=6379
```

---

## Environment Setup Scripts

### Backend Setup

```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env  # or use your preferred editor

# Verify configuration
python -c "from app.config import Config; print('Config loaded successfully')"
```

### Frontend Setup

```bash
# Copy example file
cp .env.sample .env

# Edit with your values
nano .env

# Verify configuration
npm run dev  # Should start without errors
```

---

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong, random secrets** - At least 32 characters
3. **Rotate secrets regularly** - Especially after team changes
4. **Use different secrets per environment** - Dev, staging, production
5. **Limit CORS origins** - Only allow trusted domains
6. **Use HTTPS in production** - Never send tokens over HTTP
7. **Enable rate limiting** - Protect against abuse
8. **Monitor logs** - Watch for suspicious activity

---

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U username -d heartout

# Check if database exists
psql -l | grep heartout
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli ping
# Should return: PONG
```

### JWT Token Issues

If you get "Invalid token" errors:
1. Check `JWT_SECRET_KEY` matches between backend instances
2. Verify token hasn't expired
3. Clear browser localStorage and re-login

### CORS Issues

If frontend can't connect to backend:
1. Check `CORS_ORIGINS` includes your frontend URL
2. Verify backend is running on expected port
3. Check browser console for CORS errors
