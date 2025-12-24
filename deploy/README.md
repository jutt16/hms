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
   
   Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret
   
   Add the following secrets:
   
   - **`VPS_HOST`** (Required): Your VPS IP address or domain (e.g., `192.168.1.100` or `hms.example.com`)
   - **`VPS_USER`** (Required): SSH username (usually `root` or `ubuntu`)
   - **`VPS_SSH_KEY`** (Required): Private SSH key for authentication
     - Generate a key pair: `ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions`
     - Copy the private key (`~/.ssh/github_actions`) content to this secret
     - Add the public key to your VPS: `cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys`
   - **`VPS_PORT`** (Optional): SSH port (default: `22`)
   - **`VPS_DEPLOY_PATH`** (Optional): Deployment path (default: `/var/www/hms`)
   
   **Note:** If secrets are not configured, the deployment job will be skipped automatically.

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
4. **Deploy**: Upload and deploy to VPS with release management

### Release Management

The deployment system uses a release-based approach:

- **Releases**: Stored in `/var/www/hms/releases/YYYYMMDD-HHMMSS`
- **Current Symlink**: `/var/www/hms/current` points to the active release
- **Rollback**: Keeps the last 3 releases for easy rollback
- **Atomic Updates**: Symlink is updated atomically to prevent serving old releases
- **Automatic Cleanup**: Old releases (beyond 3) are automatically removed

### Deployment Steps

Each deployment:

1. Creates a new release directory with timestamp
2. Extracts the deployment archive
3. Sets proper ownership (`www-data:www-data`) and permissions
4. Links shared directories (storage, .env) if they exist
5. Runs optional `deploy/deploy.sh` script if present
6. Runs database migrations (`php artisan migrate --force`)
7. Optimizes Laravel (config, route, view caching)
8. Atomically updates the `current` symlink
9. Reloads NGINX to serve the new release
10. Cleans up old releases (keeps last 3)
11. Removes temporary deployment files

### Manual Deployment

If you need to deploy manually:

```bash
# On your local machine
tar -czf hms.tar.gz --exclude='.git' --exclude='node_modules' --exclude='vendor' .

# Upload to VPS
scp hms.tar.gz user@your-vps-ip:/tmp/

# SSH into VPS
ssh user@your-vps-ip

# Extract and deploy using deploy-release.sh
cd /var/www/hms
RELEASE_NAME=$(date +%Y%m%d-%H%M%S)
sudo mkdir -p releases/$RELEASE_NAME
sudo tar -xzf /tmp/hms.tar.gz -C releases/$RELEASE_NAME --strip-components=0

# Use deploy-release.sh if available, otherwise manual steps
if [ -f releases/$RELEASE_NAME/deploy/deploy-release.sh ]; then
  sudo chmod +x releases/$RELEASE_NAME/deploy/deploy-release.sh
  sudo VPS_DEPLOY_PATH=/var/www/hms bash releases/$RELEASE_NAME/deploy/deploy-release.sh
else
  # Manual deployment steps
  cd releases/$RELEASE_NAME
  sudo chown -R www-data:www-data .
  sudo chmod -R 755 .
  sudo chmod -R 775 storage bootstrap/cache
  
  # Run migrations
  sudo -u www-data php artisan migrate --force
  
  # Optimize
  sudo -u www-data php artisan config:cache
  sudo -u www-data php artisan route:cache
  sudo -u www-data php artisan view:cache
  
  # Update symlink
  cd /var/www/hms
  sudo ln -sfn releases/$RELEASE_NAME current
  
  # Reload NGINX
  sudo nginx -t && sudo systemctl reload nginx
  
  # Cleanup old releases (keep last 3)
  sudo find releases -maxdepth 1 -type d -name "20*" | sort | head -n -3 | xargs -r sudo rm -rf
fi

# Cleanup
sudo rm -f /tmp/hms.tar.gz
```

## Post-Deployment

### First-Time Setup

1. **Set up environment file:**
```bash
cd /var/www/hms
sudo cp .env.example .env
sudo nano .env
# Update with your actual values
sudo -u www-data php artisan key:generate
```

2. **Run migrations and seed:**
```bash
cd /var/www/hms/current
sudo -u www-data php artisan migrate --force
sudo -u www-data php artisan db:seed
```

3. **Create storage link:**
```bash
sudo -u www-data php artisan storage:link
```

### Rollback to Previous Release

If you need to rollback to a previous release:

```bash
cd /var/www/hms
# List available releases
ls -la releases/

# Rollback to a specific release
sudo ln -sfn releases/YYYYMMDD-HHMMSS current

# Reload NGINX
sudo nginx -t && sudo systemctl reload nginx
```

## Monitoring

- **Application Logs**: `/var/www/hms/storage/logs/laravel.log`
- **Queue Worker Logs**: `/var/www/hms/storage/logs/worker.log`
- **Nginx Logs**: `/var/log/nginx/hms-access.log` and `/var/log/nginx/hms-error.log`

## Troubleshooting

### Permission Issues
```bash
sudo chown -R www-data:www-data /var/www/hms/storage
sudo chmod -R 775 /var/www/hms/storage
```

### Queue Workers Not Running
```bash
sudo supervisorctl status
sudo supervisorctl restart hms-worker:*
```

### Vite Manifest Errors

If you're getting errors like "Unable to locate file in Vite manifest", the assets need to be rebuilt:

**Quick Fix (Recommended):**
```bash
cd /var/www/hms  # or your deployment path
chmod +x deploy/quick-fix.sh
./deploy/quick-fix.sh
```

**Manual Fix:**
```bash
cd /var/www/hms
npm ci
npm run build
php artisan view:clear
php artisan config:clear
```

**Verify the fix:**
```bash
# Check if Welcome is in the manifest
grep -q "Welcome" public/build/manifest.json && echo "✅ Fixed" || echo "❌ Still missing"
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

