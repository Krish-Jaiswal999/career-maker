# WebHosting Setup Guide

This guide covers deploying Career Maker to various popular cloud platforms.

## Quick Summary

The application is now production-ready with:
- ✅ Docker containerization for frontend, backend, PostgreSQL, and Redis
- ✅ Nginx reverse proxy with SSL/TLS support
- ✅ Automatic SSL certificate management (Let's Encrypt)
- ✅ Security headers and rate limiting
- ✅ Health checks and auto-restart policies
- ✅ Environment variable configuration
- ✅ Database backup strategies
- ✅ Monitoring and logging setup

---

## Table of Contents

1. [AWS EC2](#aws-ec2)
2. [DigitalOcean](#digitalocean)
3. [Linode](#linode)
4. [Azure Container Instances](#azure-container-instances)
5. [Google Cloud Run](#google-cloud-run)
6. [Heroku](#heroku)
7. [Railway](#railway)
8. [Generic VPS](#generic-vps)

---

## AWS EC2

### Instance Setup

```bash
# Launch EC2 instance (Ubuntu 22.04 LTS, t3.medium or larger)
# Security group: Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

### Domain Configuration

1. Route 53 or Transfer Domain to AWS
2. Create DNS records pointing to EC2 Elastic IP
3. Set up Certificate Manager (optional - we use Let's Encrypt)

### Deployment

```bash
# Clone repository
cd /opt
git clone <your-monorepo-or-frontend-backend-repos>

# Run setup script
bash deploy.sh

# Follow prompts to configure environment

# Start deployment
docker-compose up -d

# Verify
docker-compose ps
```

### Cost Estimation (Monthly)

- t3.medium EC2: ~$30
- EBS Storage: ~$5
- Data Transfer: Variable
- **Total: ~$35-50/month**

---

## DigitalOcean

### Droplet Setup

```bash
# Create Droplet
# Select: Ubuntu 22.04 LTS, Basic plan ($6/month), SFO region

# SSH into droplet
ssh root@your-droplet-ip

# Create non-root user
adduser deployer
usermod -aG sudo deployer
su - deployer

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker deployer

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Domain Configuration

1. Add your domain to DigitalOcean account
2. Create 'A' record pointing to Droplet IP
3. Update nameservers at domain registrar

### Firewall

```bash
# DigitalOcean Cloud Firewall
# Inbound Rules:
# - HTTP (80) from Anywhere
# - HTTPS (443) from Anywhere
# - SSH (22) from Your IP only
```

### Cost Estimation (Monthly)

- Droplet (Basic): $6
- Backups: $2
- Bandwidth: Included (1TB)
- **Total: ~$8/month**

---

## Linode

### Linode Setup

```bash
# Create Linode instance
# Select: Ubuntu 22.04 LTS, Nanode 1GB ($5/month)

# Boot instance and SSH
ssh root@your-linode-ip

# Set hostname
sudo hostnamectl set-hostname career-maker

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $(whoami)

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Networking

1. Add domain via Linode DNS Manager
2. Create 'A' record pointing to Linode public IP
3. Create firewall rules (80, 443 for web; 22 for SSH)

### Cost Estimation (Monthly)

- Linode 1GB: $5
- Block Storage (if needed): Variable
- **Total: ~$5-15/month**

---

## Azure Container Instances

### Using Azure Container Group

```bash
# Login to Azure
az login

# Create resource group
az group create --name career-maker-rg --location eastus

# Create container group
az container create \
  --resource-group career-maker-rg \
  --name career-maker \
  --image nginx:latest \
  --ports 80 443 \
  --environment-variables \
    DATABASE_URL="postgresql://..." \
    SECRET_KEY="..." \
  --dns-name-label career-maker

# Get IP
az container show \
  --resource-group career-maker-rg \
  --name career-maker \
  --query ipAddress.fqdn
```

### Cost Estimation (Monthly)

- Container Instances (2 CPU, 3.5GB RAM): ~$50-80
- Database (Azure SQL): ~$15-30
- **Total: ~$65-110/month**

---

## Google Cloud Run

### Deployment

```bash
# Install Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Set project
gcloud config set project PROJECT_ID

# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/career-maker

# Deploy to Cloud Run
gcloud run deploy career-maker \
  --image gcr.io/PROJECT_ID/career-maker \
  --platform managed \
  --region us-central1 \
  --memory 1Gi \
  --set-env-vars DATABASE_URL="postgresql://...",SECRET_KEY="..."
```

### Cost Estimation (Monthly)

- Cloud Run (2M requests): ~$0.40
- Cloud SQL (db-f1-micro): ~$15
- Cloud Storage: ~$5
- **Total: ~$20-30/month**

---

## Heroku

### Legacy - Heroku Deprecation Notice

Heroku removed free tier and changed pricing. Alternative recommended:

### GitHub Actions Deployment

Instead of Heroku, use GitHub Actions + cloud provider:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to VPS
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no deployer@${{ secrets.SERVER_IP }} 'cd /opt/career-maker && git pull && docker-compose up -d'
```

---

## Railway

### Railway Setup

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Create services
railway add

# Deploy
railway up
```

### railway.json

```json
{
  "build": {
    "builder": "dockerfile",
    "context": "."
  },
  "deploy": {
    "startCommand": "docker-compose up"
  }
}
```

### Cost Estimation (Monthly)

- Per-service pricing: ~$5-20/month
- Database: ~$10-20/month
- **Total: ~$15-40/month**

---

## Generic VPS

### Universal Setup Script

```bash
#!/bin/bash
set -e

# Update system
sudo apt update && sudo apt upgrade -y

# Install essentials
sudo apt install -y \
  curl \
  wget \
  git \
  ufw \
  htop \
  vim

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Setup firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable -y

# Create app directory
sudo mkdir -p /opt/career-maker
cd /opt/career-maker

# Clone app
git clone <your-repo-url> .

# Run deployment
bash deploy.sh

# Start services
docker-compose up -d

echo "✓ Deployment complete!"
echo "Visit your domain to verify"
```

---

## Post-Deployment Checklist

- [ ] Domain name resolves correctly
- [ ] HTTPS works (lock icon in browser)
- [ ] API endpoints respond (`/api/health`, `/api/docs`)
- [ ] Database connections working
- [ ] Email configuration tested
- [ ] SSL certificate auto-renewal working
- [ ] Backups configured
- [ ] Monitoring/logging enabled
- [ ] Admin user created
- [ ] Rate limiting verified

---

## Monitoring and Alerting

### Health Check Endpoint

```bash
# Run daily via cron
0 */4 * * * cd /opt/career-maker && bash health-check.sh >> /var/log/career-maker-health.log
```

### Log Aggregation

```bash
# View real-time logs
docker-compose logs -f

# Export logs for analysis
docker-compose logs > logs.txt
```

### Uptime Monitoring

Recommended services:
- [Uptime Robot](https://uptimerobot.com) - Free
- [Statuspage](https://www.statuspage.io)
- [Pingdom](https://www.pingdom.com)

---

## Backup Strategy

### Automated Daily Backups

```bash
# Create backup script
cat > /opt/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/career-maker/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

cd /opt/career-maker
docker-compose exec -T postgres pg_dump -U career_user career_maker_db | gzip > $BACKUP_DIR/database.sql.gz
docker-compose exec -T redis redis-cli --rdb $BACKUP_DIR/dump.rdb

# Upload to S3/cloud storage
aws s3 cp $BACKUP_DIR s3://your-bucket/backups/ --recursive

echo "Backup completed"
EOF

chmod +x /opt/backup.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backup.sh") | crontab -
```

---

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Verify configurations
docker-compose config

# Rebuild images
docker-compose build --no-cache

# Start fresh
docker-compose down -v
docker-compose up -d
```

### SSL Certificate Issues

```bash
# Manual renewal
docker-compose run --rm certbot certbot renew --force-renewal

# Check certificate status
openssl x509 -in ssl/cert.pem -text -noout
```

### Database Connection Issues

```bash
# Check if database is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres psql -U career_user -d career_maker_db -c "SELECT 1"

# Check logs
docker-compose logs postgres
```

---

## Security Recommendations

1. **Enable Automatic Updates**
   ```bash
   sudo apt install -y unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

2. **Setup Fail2Ban**
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

3. **Use SSH Keys Only**
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Set: PasswordAuthentication no
   # Set: PubkeyAuthentication yes
   sudo systemctl restart ssh
   ```

4. **Regular Security Audits**
   - Run `docker scan` for vulnerabilities
   - Check `docker-compose logs` for suspicious activity
   - Monitor system resources

---

## Performance Tips

1. **Optimize Images**
   - Use `docker-compose build --no-cache`
   - Remove unused layers from Dockerfile

2. **Database Optimization**
   - Create database indexes
   - Use connection pooling
   - Regular VACUUM/ANALYZE

3. **Redis Optimization**
   - Increase memory allocation
   - Configure eviction policies
   - Monitor hit ratio

4. **Nginx Caching**
   - Client-side caching configured
   - GZip compression enabled
   - Static asset optimization

---

## Cost Comparison

| Platform | Minimum Cost | Notes |
|----------|------------|-------|
| DigitalOcean | $6/mo | Best for beginners |
| Linode | $5/mo | Good performance |
| AWS EC2 | $30-50/mo | Most features |
| Google Cloud | $20-30/mo | Serverless option |
| Azure | $65-110/mo | Enterprise option |
| Railway | $15-40/mo | GitHub-friendly |

---

## Getting Help

- Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions
- Review logs: `docker-compose logs -f`
- GitHub Issues: [Submit a bug report]
- Community: [Join Discord/Slack]
