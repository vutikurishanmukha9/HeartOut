import redis
import json
from flask import current_app, request
from datetime import datetime, timedelta
from typing import Dict, Optional

def get_redis_client():
    """Get Redis client for rate limiting"""
    try:
        redis_url = current_app.config.get('RATELIMIT_STORAGE_URL')
        if redis_url:
            return redis.from_url(redis_url)
        return None
    except Exception as e:
        current_app.logger.error(f"Redis connection failed: {str(e)}")
        return None

def check_rate_limit(key: str, limit: int, window: int) -> Dict:
    """
    Check if rate limit is exceeded
    
    Args:
        key: Unique identifier for the rate limit (e.g., user_id, ip_address)
        limit: Maximum number of requests allowed
        window: Time window in seconds
    
    Returns:
        Dict with rate limit information
    """
    redis_client = get_redis_client()
    
    if not redis_client:
        # If Redis is not available, allow the request
        return {
            'allowed': True,
            'remaining': limit,
            'reset_time': datetime.now() + timedelta(seconds=window)
        }
    
    try:
        current_time = datetime.now()
        window_start = current_time - timedelta(seconds=window)
        
        # Use sliding window log approach
        pipe = redis_client.pipeline()
        
        # Remove expired entries
        pipe.zremrangebyscore(key, 0, window_start.timestamp())
        
        # Count current requests
        pipe.zcard(key)
        
        # Add current request
        pipe.zadd(key, {str(current_time.timestamp()): current_time.timestamp()})
        
        # Set expiration
        pipe.expire(key, window)
        
        results = pipe.execute()
        current_count = results[1]
        
        # Check if limit exceeded
        if current_count >= limit:
            # Remove the request we just added since it's denied
            redis_client.zrem(key, str(current_time.timestamp()))
            
            return {
                'allowed': False,
                'remaining': 0,
                'reset_time': current_time + timedelta(seconds=window),
                'retry_after': window
            }
        
        return {
            'allowed': True,
            'remaining': limit - current_count - 1,
            'reset_time': current_time + timedelta(seconds=window)
        }
        
    except Exception as e:
        current_app.logger.error(f"Rate limit check failed: {str(e)}")
        # If rate limiting fails, allow the request
        return {
            'allowed': True,
            'remaining': limit,
            'reset_time': datetime.now() + timedelta(seconds=window)
        }

def get_client_ip():
    """Get client IP address considering proxies"""
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    elif request.headers.get('X-Real-IP'):
        return request.headers.get('X-Real-IP')
    else:
        return request.remote_addr

def crisis_rate_limit(user_id: str) -> bool:
    """
    Special rate limiting for crisis situations
    More lenient limits for users in crisis
    """
    rate_limit_result = check_rate_limit(
        f"crisis:{user_id}", 
        limit=10,  # Allow more crisis posts
        window=3600  # Per hour
    )
    
    return rate_limit_result['allowed']

def support_rate_limit(user_id: str) -> bool:
    """Rate limiting for support actions"""
    rate_limit_result = check_rate_limit(
        f"support:{user_id}",
        limit=50,  # Allow many support actions
        window=3600  # Per hour
    )
    
    return rate_limit_result['allowed']