# HMS Deployment Guide

This directory contains deployment scripts and configuration files for the Hospital Management System.

## Prerequisites

1. **VPS Requirements:**
   - Ubuntu 20.04+ or Debian 11+
   - PHP 8.2+ with required extensions
   - MySQL 8.0+ or MariaDB 10.5+
   - Nginx or Apache
   - Node.js 20+ and npm
   - Composer
   - Supervisor (for queue workers)

2. **GitHub Secrets Setup:**
   Add the following secrets to your GitHub repository:
   - `VPS_HOST`: Your VPS IP address or domain
   - `VPS_USER`: SSH username (usually `root` or `ubuntu`)
   - `VPS_SSH_KEY`: Private SSH key for authentication
   - `VPS_PORT`: SSH port (default: 22)
   - `VPS_DEPLOY_PATH`: Deployment path (default: `/var/www/hms`)

## Initial VPS Setup

### 1. Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP and extensions
sudo apt install -y php8.2-fpm php8.2-cli php8.2-mysql php8.2-mbstring \
    php8.2-xml php8.2-bcmath php8.2-curl php8.2-zip php8.2-gd

# Install MySQL
sudo apt install -y mysql-server

# Install Nginx
sudo apt install -y nginx

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Supervisor
sudo apt install -y supervisor
```

### 2. Create Deployment Directory

```bash
sudo mkdir -p /var/www/hms
sudo chown -R $USER:www-data /var/www/hms
sudo chmod -R 775 /var/www/hms
```

### 3. Setup Database

```bash
sudo mysql -u root -p

# In MySQL prompt:
CREATE DATABASE hms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hms_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON hms.* TO 'hms_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Configure Nginx

1. Copy the nginx configuration:
```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/hms
```

2. Update the configuration with your domain:
```bash
sudo nano /etc/nginx/sites-available/hms
# Replace 'yourdomain.com' with your actual domain
```

3. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/hms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 6. Configure Supervisor

1. Copy supervisor configuration:
```bash
sudo cp deploy/supervisor.conf /etc/supervisor/conf.d/hms-worker.conf
```

2. Update the configuration:
```bash
sudo nano /etc/supervisor/conf.d/hms-worker.conf
# Update paths if needed
```

3. Reload supervisor:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start hms-worker:*
```

### 7. Setup SSH Key for GitHub Actions

1. Generate SSH key pair on your local machine:
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/vps_deploy_key
```

2. Copy public key to VPS:
```bash
ssh-copy-id -i ~/.ssh/vps_deploy_key.pub user@your-vps-ip
```

3. Add private key to GitHub Secrets:
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Add new secret: `VPS_SSH_KEY`
   - Paste the content of `~/.ssh/vps_deploy_key` (private key)

## Deployment Process

The CI/CD pipeline will automatically:

1. **Run Tests**: Execute all Pest tests
2. **Lint Code**: Check code style with Pint
3. **Build Assets**: Compile frontend assets
4. **Deploy**: Upload and deploy to VPS

### Manual Deployment

If you need to deploy manually:

```bash
# On your local machine
tar -czf hms.tar.gz --exclude='.git' --exclude='node_modules' --exclude='vendor' .

# Upload to VPS
scp hms.tar.gz user@your-vps-ip:/tmp/

# SSH into VPS
ssh user@your-vps-ip

# Extract and deploy
cd /var/www/hms
sudo mkdir -p releases/$(date +%Y%m%d-%H%M%S)
sudo tar -xzf /tmp/hms.tar.gz -C releases/$(date +%Y%m%d-%H%M%S)
cd releases/$(date +%Y%m%d-%H%M%S)
sudo bash deploy/deploy.sh
cd /var/www/hms
sudo rm -f current
sudo ln -s releases/$(date +%Y%m%d-%H%M%S) current
```

## Post-Deployment

1. **Set up environment file:**
```bash
cd /var/www/hms/current
sudo cp .env.example .env
sudo nano .env
# Update with your actual values
php artisan key:generate
```

2. **Run migrations and seed:**
```bash
php artisan migrate --force
php artisan db:seed
```

3. **Create storage link:**
```bash
php artisan storage:link
```

## Monitoring

- **Application Logs**: `/var/www/hms/current/storage/logs/laravel.log`
- **Queue Worker Logs**: `/var/www/hms/storage/logs/worker.log`
- **Nginx Logs**: `/var/log/nginx/hms-access.log` and `/var/log/nginx/hms-error.log`

## Troubleshooting

### Permission Issues
```bash
sudo chown -R www-data:www-data /var/www/hms/current/storage
sudo chmod -R 775 /var/www/hms/current/storage
```

### Queue Workers Not Running
```bash
sudo supervisorctl status
sudo supervisorctl restart hms-worker:*
```

### Clear Caches
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Check PHP-FPM Status
```bash
sudo systemctl status php8.2-fpm
sudo systemctl restart php8.2-fpm
```

