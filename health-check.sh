#!/bin/bash

# Health Check Script for Career Maker Production Deployment
# Run this daily to verify all services are healthy

DOMAIN="${1:-localhost}"
PROTOCOL="https"
if [[ "$DOMAIN" == "localhost" ]]; then
    PROTOCOL="http"
fi

echo "================================="
echo "Career Maker Health Check Report"
echo "================================="
echo "Timestamp: $(date)"
echo "Domain: $DOMAIN"
echo ""

# Check nginx
echo "[1/5] Checking Nginx..."
if curl -s -I ${PROTOCOL}://${DOMAIN}/ > /dev/null 2>&1; then
    echo "✓ Nginx is responding"
else
    echo "✗ Nginx is NOT responding"
fi

# Check API
echo "[2/5] Checking API..."
if curl -s ${PROTOCOL}://${DOMAIN}/api/health | grep -q "healthy"; then
    echo "✓ API health check passed"
else
    echo "✗ API health check FAILED"
fi

# Check database connection
echo "[3/5] Checking Database..."
docker-compose exec -T postgres pg_isready -U career_user > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Database is healthy"
else
    echo "✗ Database connection FAILED"
fi

# Check redis
echo "[4/5] Checking Redis..."
docker-compose exec -T redis redis-cli ping > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Redis is healthy"
else
    echo "✗ Redis connection FAILED"
fi

# Check SSL certificate
echo "[5/5] Checking SSL Certificate..."
if [ -f "ssl/cert.pem" ]; then
    EXP_DATE=$(openssl x509 -in ssl/cert.pem -noout -enddate | cut -d= -f2)
    DAYS_LEFT=$(( ($(date -d "$EXP_DATE" +%s) - $(date +%s)) / 86400 ))
    if [ $DAYS_LEFT -gt 30 ]; then
        echo "✓ SSL certificate is valid (expires in $DAYS_LEFT days)"
    elif [ $DAYS_LEFT -gt 7 ]; then
        echo "⚠ SSL certificate expiring soon (expires in $DAYS_LEFT days)"
    else
        echo "✗ SSL certificate expires in $DAYS_LEFT days - RENEW IMMEDIATELY"
    fi
else
    echo "⚠ SSL certificate not found"
fi

echo ""
echo "================================="
echo "Health Check Complete"
echo "================================="
