#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Get the directory where the script is located
DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DEPLOY_DIR"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Install/Update Composer dependencies
echo "📦 Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Install/Update NPM dependencies (if needed)
# Note: Install all dependencies (including dev) as they're needed for building assets
if [ -f package.json ]; then
    echo "📦 Installing NPM dependencies..."
    npm ci --prefer-offline --no-audit
fi

# Build frontend assets (assets are pre-built in CI/CD, but rebuild here as fallback)
if [ -f package.json ]; then
    echo "🏗️  Building frontend assets..."
    npm run build
fi

# Set proper permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Run migrations
echo "🗄️  Running database migrations..."
php artisan migrate --force

# Clear and cache configuration
echo "⚙️  Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Clear application cache
php artisan cache:clear

# Restart queue workers (if using supervisor)
if command -v supervisorctl &> /dev/null; then
    echo "🔄 Restarting queue workers..."
    sudo supervisorctl restart hms-worker:*
fi

# Restart PHP-FPM (adjust based on your setup)
if command -v systemctl &> /dev/null; then
    echo "🔄 Reloading PHP-FPM..."
    sudo systemctl reload php8.2-fpm || sudo systemctl reload php-fpm || true
fi

# Clear OPcache
php artisan opcache:clear || true

echo "✅ Deployment completed successfully!"

