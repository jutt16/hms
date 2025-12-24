#!/bin/bash

# Quick fix script to rebuild assets on production server
# Run this on your VPS if you're getting Vite manifest errors

set -e

echo "🔧 Quick Fix: Rebuilding Vite assets..."

# Navigate to application directory
# Update this path to match your deployment path
DEPLOY_PATH="${1:-/var/www/hms}"
cd "$DEPLOY_PATH" || {
    echo "❌ Error: Could not find deployment directory: $DEPLOY_PATH"
    echo "Usage: $0 [deployment_path]"
    exit 1
}

echo "📍 Working directory: $(pwd)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    exit 1
fi

# Install NPM dependencies (including dev dependencies for build)
echo "📦 Installing NPM dependencies..."
npm ci --prefer-offline --no-audit

# Build assets
echo "🏗️  Building frontend assets..."
npm run build

# Verify build
if [ ! -f "public/build/manifest.json" ]; then
    echo "❌ Error: Build failed - manifest.json not found"
    exit 1
fi

# Check if Welcome is in manifest
if grep -q "Welcome" public/build/manifest.json; then
    echo "✅ Welcome component found in manifest"
else
    echo "⚠️  Warning: Welcome component not found in manifest"
    echo "Manifest contents:"
    cat public/build/manifest.json
fi

# Clear Laravel caches
echo "🧹 Clearing Laravel caches..."
php artisan view:clear
php artisan config:clear
php artisan cache:clear

echo "✅ Quick fix completed!"
echo ""
echo "If you're still seeing errors, try:"
echo "  - Restart PHP-FPM: sudo systemctl reload php8.2-fpm"
echo "  - Check file permissions: sudo chown -R www-data:www-data storage bootstrap/cache public/build"

