#!/bin/bash

# Production Deployment Setup Script for Career Maker
# This script automates the initial setup for production deployment

set -e

echo "=========================================="
echo "Career Maker - Production Setup"
echo "=========================================="
echo ""

# Check dependencies
echo "[1/5] Checking dependencies..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "ERROR: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✓ Docker and Docker Compose found"
echo ""

# Create .env file
echo "[2/5] Setting up environment variables..."
if [ -f ".env" ]; then
    echo "⚠ .env file already exists. Skipping..."
else
    # Generate secure passwords
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=" | cut -c1-25)
    REDIS_PASSWORD=$(openssl rand -base64 32 | tr -d "=" | cut -c1-25)
    SECRET_KEY=$(openssl rand -base64 32)
    
    cat > .env << EOF
# Generated on $(date)
POSTGRES_USER=career_user
POSTGRES_PASSWORD=${DB_PASSWORD}
POSTGRES_DB=career_maker_db
REDIS_PASSWORD=${REDIS_PASSWORD}
ENVIRONMENT=production
DEBUG=False
DOMAIN_NAME=yourdomain.com
CERTBOT_EMAIL=your-email@example.com
EOF
    
    echo "✓ .env file created with secure passwords"
    echo "⚠ IMPORTANT: Update .env with your domain name and email"
fi
echo ""

# Create backend .env
echo "[3/5] Setting up backend configuration..."
if [ -f "backend/.env" ]; then
    echo "⚠ backend/.env file already exists. Skipping..."
else
    cp backend/.env.production.example backend/.env
    echo "✓ Backend .env created from template"
    echo "⚠ IMPORTANT: Edit backend/.env with your actual configuration"
fi
echo ""

# Create SSL directory
echo "[4/5] Setting up SSL directory..."
mkdir -p ssl
echo "✓ SSL directory created"
echo ""

# Build images
echo "[5/5] Building Docker images..."
docker-compose build

echo ""
echo "=========================================="
echo "✓ Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file:"
echo "   nano .env"
echo ""
echo "2. Edit backend/.env file with your actual credentials:"
echo "   nano backend/.env"
echo ""
echo "3. For SSL certificates:"
echo "   docker-compose run --rm certbot"
echo "   OR place your cert.pem and key.pem in ./ssl/"
echo ""
echo "4. Start the deployment:"
echo "   docker-compose up -d"
echo ""
echo "5. Verify it's running:"
echo "   docker-compose ps"
echo ""
echo "6. Check logs:"
echo "   docker-compose logs -f nginx"
echo ""
echo "Your application will be available at:"
echo "  http://yourdomain.com (redirects to https)"
echo "  https://yourdomain.com"
echo ""
echo "API documentation available at:"
echo "  https://yourdomain.com/api/docs"
echo ""
