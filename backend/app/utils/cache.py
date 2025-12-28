"""
Simple Cache Utility for Backend Performance

Provides a simple in-memory cache with optional Redis support.
Falls back gracefully when Redis is unavailable.
"""
import os
import time
import json
import functools
from typing import Any, Optional, Callable

# Try to import Redis, fallback to None if not available
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    redis = None
    REDIS_AVAILABLE = False


class SimpleCache:
    """
    Simple caching with Redis support and memory fallback.
    
    Usage:
        cache = SimpleCache()
        cache.set('key', data, ttl=60)  # Cache for 60 seconds
        data = cache.get('key')
    """
    
    def __init__(self):
        self._memory_cache = {}
        self._redis_client = None
        self._init_redis()
    
    def _init_redis(self):
        """Initialize Redis connection if available."""
        if not REDIS_AVAILABLE:
            return
        
        redis_url = os.environ.get('REDIS_URL')
        if redis_url:
            try:
                self._redis_client = redis.from_url(
                    redis_url,
                    socket_connect_timeout=2,
                    socket_timeout=2
                )
                # Test connection
                self._redis_client.ping()
            except Exception:
                self._redis_client = None
    
    @property
    def using_redis(self) -> bool:
        """Check if Redis is being used."""
        return self._redis_client is not None
    
    def get(self, key: str) -> Optional[Any]:
        """
        Get value from cache.
        
        Returns None if key doesn't exist or is expired.
        """
        # Try Redis first
        if self._redis_client:
            try:
                value = self._redis_client.get(key)
                if value:
                    return json.loads(value)
            except Exception:
                pass
        
        # Fallback to memory cache
        if key in self._memory_cache:
            entry = self._memory_cache[key]
            if entry['expires_at'] > time.time():
                return entry['value']
            else:
                # Expired, remove it
                del self._memory_cache[key]
        
        return None
    
    def set(self, key: str, value: Any, ttl: int = 60) -> bool:
        """
        Set value in cache with TTL (time to live) in seconds.
        
        Args:
            key: Cache key
            value: Value to cache (must be JSON serializable)
            ttl: Time to live in seconds (default: 60)
        
        Returns:
            True if cached successfully
        """
        # Try Redis first
        if self._redis_client:
            try:
                self._redis_client.setex(key, ttl, json.dumps(value))
                return True
            except Exception:
                pass
        
        # Fallback to memory cache
        self._memory_cache[key] = {
            'value': value,
            'expires_at': time.time() + ttl
        }
        return True
    
    def delete(self, key: str) -> bool:
        """Delete a key from cache."""
        # Try Redis
        if self._redis_client:
            try:
                self._redis_client.delete(key)
            except Exception:
                pass
        
        # Also remove from memory cache
        if key in self._memory_cache:
            del self._memory_cache[key]
        
        return True
    
    def clear_pattern(self, pattern: str) -> int:
        """
        Clear all keys matching pattern.
        
        Args:
            pattern: Pattern to match (e.g., 'feed:*')
        
        Returns:
            Number of keys deleted
        """
        deleted = 0
        
        # Redis pattern delete
        if self._redis_client:
            try:
                keys = self._redis_client.keys(pattern)
                if keys:
                    deleted = self._redis_client.delete(*keys)
            except Exception:
                pass
        
        # Memory cache pattern delete (simple prefix matching)
        prefix = pattern.rstrip('*')
        keys_to_delete = [k for k in self._memory_cache if k.startswith(prefix)]
        for key in keys_to_delete:
            del self._memory_cache[key]
            deleted += 1
        
        return deleted


# Global cache instance
cache = SimpleCache()


def cached(ttl: int = 60, key_prefix: str = ''):
    """
    Decorator for caching function results.
    
    Usage:
        @cached(ttl=30, key_prefix='feed')
        def get_feed(page, story_type):
            return expensive_query()
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Build cache key from function name and arguments
            cache_key = f"{key_prefix}:{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            result = cache.get(cache_key)
            if result is not None:
                return result
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            return result
        
        return wrapper
    return decorator
