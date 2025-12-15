# HeartOut Backend Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_ENV=production

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for caching)
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Create startup script that runs migrations
RUN echo '#!/bin/bash\nflask db upgrade 2>/dev/null || python -c "from app import create_app; from app.extensions import db; app = create_app(); app.app_context().push(); db.create_all(); print(\"Tables created!\")"\nexec gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 2 --threads 4 "app:create_app()"' > /app/start.sh && chmod +x /app/start.sh

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT:-5000}/api/auth/health || exit 1

# Run startup script (migrations + gunicorn)
CMD ["/bin/bash", "/app/start.sh"]
