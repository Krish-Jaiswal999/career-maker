# Production Deployment Guide

This guide covers deploying the Career Maker application to a production environment using Docker and Docker Compose.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Environment Setup](#environment-setup)
4. [SSL/TLS Configuration](#ssltls-configuration)
5. [Deployment Steps](#deployment-steps)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Troubleshooting](#troubleshooting)
8. [Backup and Recovery](#backup-and-recovery)

---

## Prerequisites

- Docker and Docker Compose (version 20.10+)
- A domain name (for SSL certificates)
- Server with at least 2GB RAM (4GB+ recommended)
- Ubuntu 20.04+ or similar Linux distribution
- SSH access to the server
- Basic knowledge of Docker and Linux

---

## Pre-Deployment Checklist

- [ ] Domain name purchased and DNS configured
- [ ] Server provisioned with public IP
- [ ] Docker and Docker Compose installed
- [ ] SSH key configured for server access
- [ ] Database credentials generated and secured
- [ ] Redis password set
- [ ] JWT SECRET_KEY generated (minimum 32 characters)
- [ ] CORS origins updated for your domain
- [ ] Email configuration set up (SMTP)
- [ ] ROLE_SKILL_API_TOKEN configured for skill lookup
- [ ] SSL certificates ready (Let's Encrypt or purchased)
- [ ] Firewall rules configured (80, 443 open)

---

## Environment Setup

### 1. Clone Repository

```bash
cd /opt
git clone https://github.com/Krish-Jaiswal999/career-maker-backend.git backend
git clone https://github.com/Krish-Jaiswal999/career-maker-frontend.git frontend
# Or clone the monorepo and organize directories appropriately
```

### 2. Create Production Environment Files

**Backend `.env` file:**

```bash
cp backend/.env.production.example backend/.env
nano backend/.env
```

Update the following variables:

```env
# CRITICAL: Change all these values!
DATABASE_URL=postgresql://career_user:YOUR_SECURE_PASSWORD@postgres:5432/career_maker_db
SECRET_KEY=YOUR_MIN_32_CHAR_RANDOM_STRING
REDIS_URL=redis://:YOUR_REDIS_PASSWORD@redis:6379
SMTP_SERVER=smtp.gmail.com  # or your email provider
SENDER_EMAIL=your-email@example.com
SENDER_PASSWORD=your-app-password
ROLE_SKILL_API_URL=https://api.deepseek.com
ROLE_SKILL_API_TOKEN=your-api-token-here
ROLE_SKILL_API_CACHE_TTL_SECONDS=3600
ALLOWED_ORIGINS=["https://yourdomain.com", "https://www.yourdomain.com"]
ENVIRONMENT=production
DEBUG=False
LOG_LEVEL=info
```

### 3. Generate Secure Passwords

```bash
# Generate a secure JWT SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Generate other passwords
openssl rand -base64 32
```

### 4. Create .env for Docker Compose

Create a `.env` file in the root directory:

```bash
cat > .env << EOF
# Database
POSTGRES_USER=career_user
POSTGRES_PASSWORD=YOUR_SECURE_DB_PASSWORD
POSTGRES_DB=career_maker_db

# Redis
REDIS_PASSWORD=YOUR_SECURE_REDIS_PASSWORD

# Application
ENVIRONMENT=production
DEBUG=False

# SSL/Certbot
DOMAIN_NAME=yourdomain.com
CERTBOT_EMAIL=your-email@example.com
EOF
```

---

## SSL/TLS Configuration

### Option 1: Let's Encrypt (Free & Automated)

The docker-compose includes a certbot service for automatic SSL certificate generation:

```bash
# Update docker-compose.yml with your domain
# Update .env with DOMAIN_NAME and CERTBOT_EMAIL

# Run certbot service
docker-compose run --rm certbot

# This creates certificates in ./ssl/
```

### Option 2: Self-Signed Certificate (Testing Only)

```bash
mkdir -p ssl
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes
```

### Option 3: Pre-Generated Certificates

Place your certificate and key in:
- `./ssl/cert.pem`
- `./ssl/key.pem`

---

## Deployment Steps

### 1. Initial Deployment

```bash
# Navigate to project directory
cd /opt/career-maker

# Build all services
docker-compose build

# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs -f nginx
docker-compose logs -f backend
```

### 2. Run Database Migrations (if needed)

```bash
docker-compose exec backend alembic upgrade head
# or
docker-compose exec backend python -m app.database.init_db
```

### 3. Verify Deployment

```bash
# Check API health
curl https://yourdomain.com/api/health

# Check nginx
curl -I https://yourdomain.com/

# View logs
docker-compose logs --follow backend
```

### 4. Enable Auto-Restart

```bash
# Add to docker-compose.yml restart policy (already configured)
# or enable on the server
sudo systemctl daemon-reload
```

---

## Monitoring and Maintenance

### 1. View Logs

```bash
# All services
docker-compose logs --follow

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f redis
docker-compose logs -f nginx
```

### 2. Service Health

```bash
# Check running services
docker-compose ps

# Detailed service information
docker stats
```

### 3. Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U career_user career_maker_db > backup.sql

# Restore from backup
docker-compose exec -T postgres psql -U career_user career_maker_db < backup.sql
```

### 4. Regular Updates

```bash
# Update images
docker-compose pull
docker-compose up -d

# Remove unused resources
docker system prune -a
```

### 5. SSL Certificate Renewal

```bash
# Manual renewal
docker-compose run --rm certbot certbot renew

# Auto-renewal (set as cron job)
0 12 * * * cd /opt/career-maker && docker-compose run --rm certbot certbot renew
```

---

## Troubleshooting

### 1. Connection Refused

```bash
# Check if services are running
docker-compose ps

# View logs
docker-compose logs backend

# Restart services
docker-compose restart
```

### 2. Database Connection Error

```bash
# Verify database is running
docker-compose logs postgres

# Check connection string in .env
grep DATABASE_URL backend/.env

# Test connection
docker-compose exec postgres psql -U career_user -d career_maker_db -c "SELECT 1"
```

### 3. SSL Certificate Issues

```bash
# Check certificate
openssl x509 -in ssl/cert.pem -text -noout

# Check nginx SSL configuration
docker-compose exec nginx nginx -t

# View certbot logs
docker-compose logs certbot
```

### 4. High Memory Usage

```bash
# Check container stats
docker stats

# Reduce worker processes in docker-compose.yml
# Adjust postgres shared_buffers
```

### 5. Disk Space Issues

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a --volumes

# Clean up old logs
docker-compose logs --remove
```

---

## Backup and Recovery

### 1. Full Backup

```bash
#!/bin/bash
BACKUP_DIR="/backups/career-maker/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T postgres pg_dump -U career_user career_maker_db > $BACKUP_DIR/database.sql

# Backup Redis
docker-compose exec -T redis redis-cli --rdb $BACKUP_DIR/dump.rdb

# Backup configuration
cp backend/.env $BACKUP_DIR/backend.env
cp .env $BACKUP_DIR/compose.env

echo "Backup completed to $BACKUP_DIR"
```

### 2. Restore from Backup

```bash
# Restore database
docker-compose up -d postgres
sleep 10
docker-compose exec -T postgres psql -U career_user career_maker_db < /backups/database.sql

# Restore Redis
docker-compose cp /backups/dump.rdb redis:/data/dump.rdb
```

### 3. Automated Daily Backups

```bash
# Add to crontab
0 2 * * * /opt/career-maker/backup.sh

# Check cron
crontab -l
```

---

## Scaling and Performance

### 1. Increase Backend Workers

Edit `docker-compose.yml`:

```yaml
backend:
  environment:
    WORKERS: 8  # Increase from default 4
```

### 2. Database Connection Pooling

Edit `backend/.env`:

```env
DB_POOL_SIZE=30
DB_MAX_OVERFLOW=20
```

### 3. Redis Optimization

Edit `docker-compose.yml`:

```yaml
redis:
  command: redis-server --maxmemory 1gb --maxmemory-policy allkeys-lru
```

### 4. Nginx Caching

Already configured in `nginx.conf` for:
- Static assets (1 hour)
- API responses (configurable per endpoint)

---

## Security Best Practices

1. **Keep Secrets Secure**
   - Use strong passwords (32+ characters)
   - Rotate keys regularly
   - Never commit `.env` to version control

2. **Firewall Configuration**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```

3. **Regular Updates**
   - Keep Docker images updated
   - Monitor CVE reports
   - Apply security patches

4. **Database Security**
   - Use strong PostgreSQL password
   - Regular backups
   - Encrypt backups

5. **SSL/TLS**
   - Always use HTTPS
   - Set HSTS headers (configured)
   - Keep certificates updated

6. **Rate Limiting**
   - Configured in nginx.conf
   - Adjust based on load

7. **Access Control**
   - Restrict SSH access
   - Use strong authentication
   - Monitor access logs

---

## Quick Reference Commands

```bash
# Start deployment
docker-compose up -d

# Stop deployment
docker-compose down

# View logs
docker-compose logs -f [service]

# Execute command in container
docker-compose exec [service] [command]

# Rebuild images
docker-compose build --no-cache

# View current config
docker-compose config

# Health check
curl https://yourdomain.com/api/health

# Database backup
docker-compose exec postgres pg_dump -U career_user career_maker_db > backup.sql

# Database restore
docker-compose exec -T postgres psql -U career_user career_maker_db < backup.sql

# Update all services
docker-compose pull && docker-compose up -d

# View resource usage
docker stats
```

---

## Support and Issues

For issues or questions:
1. Check Docker logs: `docker-compose logs`
2. Review nginx error logs: `docker-compose logs nginx`
3. Check application logs: `docker-compose logs backend`
4. Verify environment configuration: `docker-compose config`
5. Review security headers: `curl -I https://yourdomain.com`

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [PostgreSQL Backup/Restore](https://www.postgresql.org/docs/13/backup.html)
- [Let's Encrypt](https://letsencrypt.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)
