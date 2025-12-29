"""
FastAPI Tests Package

Async test suite for HeartOut FastAPI backend.
Uses pytest-asyncio for async tests and httpx for async HTTP client.

Test files:
- conftest.py: Async fixtures and database setup
- test_health.py: Health and root endpoint tests
- test_auth.py: Authentication tests (register, login, profile)
- test_stories.py: Story CRUD tests
- test_reactions.py: Reaction/support tests
- test_integration.py: End-to-end user journey tests
- test_security.py: Security and authorization tests
- test_admin.py: Admin endpoint access tests

Run tests with:
    pytest fastapi_app/tests/ -v --asyncio-mode=auto
"""

import pytest

# Configure pytest-asyncio mode
pytest_plugins = ['pytest_asyncio']
