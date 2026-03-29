# Configuration Guide

## Environment Variables (.env)

### Database Configuration
```env
# PostgreSQL connection string
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE

# Local development example:
DATABASE_URL=postgresql://career_user:career_password@localhost:5432/career_maker_db

# Supabase example (cloud PostgreSQL):
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECTID.supabase.co:5432/postgres
```

### JWT Authentication
```env
# Secret key for signing JWT tokens (change this!)
SECRET_KEY=your-super-secret-key-change-this-in-production-12345

# JWT algorithm
ALGORITHM=HS256

# Token expiration time in minutes
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### AI Integration
```env
# Live role skill API
ROLE_SKILL_API_URL=https://api.deepseek.com
ROLE_SKILL_API_TOKEN=your-api-token-here
ROLE_SKILL_API_CACHE_TTL_SECONDS=3600
```

### Web Scraping
```env
# LinkedIn credentials (use with caution - LinkedIn ToS)
# Note: Direct scraping is heavily blocked. Use with proxies.
LINKEDIN_EMAIL=your-email@example.com
LINKEDIN_PASSWORD=your-password

# Proxy configuration for scraping
PROXY_LIST=http://proxy1.com:8080,http://proxy2.com:8080
```

### Redis Cache
```env
# Redis connection for caching and sessions
REDIS_URL=redis://localhost:6379

# Redis with authentication
REDIS_URL=redis://user:password@localhost:6379
```

### Application Environment
```env
# Environment mode
ENVIRONMENT=development  # or: production, staging

# Debug mode (False in production)
DEBUG=True

# Log level
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL
```

### CORS & Security
```env
# Allowed origins for frontend requests
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:8000", "https://yourdomain.com"]

# CORS credentials
CORS_CREDENTIALS=true
```

### Email Configuration (Future)
```env
# For email notifications
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@careerpathplanner.com
```

### Third-party APIs
```env
# GitHub API (for trending projects)
GITHUB_API_KEY=your-github-token

# YouTube API (for course recommendations)
YOUTUBE_API_KEY=your-youtube-api-key

# Google Books API
GOOGLE_BOOKS_API_KEY=your-api-key
```

---

## PostgreSQL Setup

### Local Installation

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Run installer
3. Remember the password for 'postgres' user
4. pgAdmin is included

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu):**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database & User

```sql
-- Connect as superuser
psql -U postgres

-- Create database
CREATE DATABASE career_maker_db;

-- Create user
CREATE USER career_user WITH PASSWORD 'career_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE career_maker_db TO career_user;

-- Configure settings
ALTER ROLE career_user SET client_encoding TO 'utf8';
ALTER ROLE career_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE career_user SET default_transaction_deferrable TO on;
ALTER ROLE career_user SET timezone TO 'UTC';

-- Exit
\q
```

### Verify Connection

```bash
psql -U career_user -d career_maker_db -h localhost
# Should connect without errors
```

---

## Redis Setup

### Local Installation

**Windows:**
1. Download from https://github.com/microsoftarchive/redis/releases
2. Or use Windows Subsystem for Linux (WSL)

**Mac:**
```bash
brew install redis
brew services start redis
```

**Linux (Ubuntu):**
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
```

### Verify Redis

```bash
redis-cli ping
# Should return: PONG
```

---

## API Keys & Services

### RoleSkill API
1. Get your ROLE_SKILL_API_TOKEN from your skill provider
2. Add to `.env`: `ROLE_SKILL_API_TOKEN=your-api-token-here`
3. Set `ROLE_SKILL_API_URL` if not using the default endpoint

### GitHub
1. Go to https://github.com/settings/tokens
2. Generate new classic token
3. Scope: `public_repo`, `read:user`
4. Add to .env: `GITHUB_API_KEY=ghp_...`

### YouTube
1. Go to https://console.developers.google.com
2. Create new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials
5. Add to .env: `YOUTUBE_API_KEY=...`

---

## Environment-Specific Configurations

### Development (.env.development)
```env
DATABASE_URL=postgresql://career_user:password@localhost:5432/career_maker_db
DEBUG=True
ENVIRONMENT=development
CORS_CREDENTIALS=true
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:8000"]
```

### Production (.env.production)
```env
DATABASE_URL=postgresql://user:PASSWORD@prod-db.example.com:5432/career_maker
DEBUG=False
ENVIRONMENT=production
SECRET_KEY=VERY_LONG_RANDOM_SECRET_KEY
CORS_CREDENTIALS=false
ALLOWED_ORIGINS=["https://careerpathplanner.com"]
LOG_LEVEL=WARNING
```

### Testing (.env.test)
```env
DATABASE_URL=sqlite:///./test.db
DEBUG=True
ENVIRONMENT=testing
SECRET_KEY=test-secret-key
```

---

## Docker Environment Variables

### Docker Compose
```env
# .env file for docker-compose
POSTGRES_USER=career_user
POSTGRES_PASSWORD=career_password
POSTGRES_DB=career_maker_db

DATABASE_URL=postgresql://career_user:career_password@postgres:5432/career_maker_db
REDIS_URL=redis://redis:6379

ROLE_SKILL_API_URL=https://api.deepseek.com
ROLE_SKILL_API_TOKEN=your-api-token-here
SECRET_KEY=docker-secret-key
```

### Docker Build Arguments
```dockerfile
# In Dockerfile
ARG PYTHON_VERSION=3.11
ENV APP_HOME=/app
ENV PYTHONUNBUFFERED=1
```

---

## Configuration Best Practices

1. **Never commit .env** - Use .env.example as template
2. **Use strong secrets** - Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
3. **Environment-specific settings** - Use different .env for dev/prod
4. **Rotate secrets** - Especially in production
5. **Use secrets manager** - In production, use AWS Secrets Manager, Vault, etc.
6. **Document requirements** - Keep .env.example updated
7. **Validate on startup** - Check required vars exist

---

## Troubleshooting Configuration

### Port conflicts
```bash
# Change in .env or startup command
# Instead of port 8000, use 8001
python -m uvicorn app.main:app --port 8001
```

### Database connection issues
```bash
# Test connection
psql -U career_user -d career_maker_db -h localhost

# Check .env variables
cat .env | grep DATABASE_URL
```

### Redis connection issues
```bash
# Test Redis
redis-cli -h localhost -p 6379 ping

# Check .env
cat .env | grep REDIS_URL
```

### CORS errors
```bash
# Add your domain to ALLOWED_ORIGINS
ALLOWED_ORIGINS=["http://localhost:3000", "https://yourdomain.com"]
```

---

## Production Deployment Checklist

- [ ] Change SECRET_KEY to strong random string
- [ ] Set DEBUG=False
- [ ] Use strong database passwords
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure CloudFront/CDN for static files
- [ ] Set up logging/monitoring
- [ ] Configure error tracking (Sentry)
- [ ] Set up automated backups
- [ ] Test environment variables on staging
- [ ] Use environment-specific databases
- [ ] Enable database encryption
- [ ] Set up SSL certificates

---

## Quick Config Setup

```bash
# Generate strong SECRET_KEY
python -c "import secrets; print(f'SECRET_KEY={secrets.token_urlsafe(32)}')" >> backend/.env

# Copy template
cp backend/.env.example backend/.env

# Edit with your values
nano backend/.env  # or use your editor
```

---

For more information, refer to:
- [FastAPI Settings](https://fastapi.tiangolo.com/advanced/settings/)
- [SQLAlchemy Dialects](https://docs.sqlalchemy.org/en/20/dialects/postgresql.html)
- [Python-dotenv Documentation](https://python-dotenv.readthedocs.io/)
