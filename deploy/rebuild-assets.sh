#!/bin/bash

# Quick script to rebuild assets on production server
# Usage: sudo bash deploy/rebuild-assets.sh

set -e

echo "🔧 Rebuilding assets on production server..."

# Detect deployment path
if [ -L "/var/www/hms/current" ]; then
    DEPLOY_DIR=$(readlink -f /var/www/hms/current)
    echo "📍 Found deployment at: $DEPLOY_DIR"
elif [ -d "/var/www/hms" ]; then
    DEPLOY_DIR="/var/www/hms"
    echo "📍 Using deployment directory: $DEPLOY_DIR"
else
    echo "❌ Error: Could not find deployment directory"
    echo "Please specify the path manually or ensure /var/www/hms exists"
    exit 1
fi

cd "$DEPLOY_DIR"

# Check if Node.js is available
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Error: Node.js is not installed"
    echo "Install Node.js: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs"
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "❌ Error: npm is not installed"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing npm dependencies..."
sudo -u www-data npm ci --production || {
    echo "⚠️  npm ci failed, trying npm install..."
    sudo -u www-data npm install --production
}

# Build assets
echo "🔨 Building assets..."
sudo -u www-data npm run build

# Verify build
if [ ! -f "public/build/manifest.json" ]; then
    echo "❌ Error: Build failed - manifest.json not found"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build files location: $DEPLOY_DIR/public/build/"
ls -lh public/build/ | head -10

# Clear Laravel caches
echo "🧹 Clearing Laravel caches..."
sudo -u www-data php artisan view:clear || true
sudo -u www-data php artisan config:clear || true
sudo -u www-data php artisan route:clear || true

echo ""
echo "✅ Assets rebuilt successfully!"
echo "🔄 You may need to reload NGINX: sudo systemctl reload nginx"
echo "🌐 Clear your browser cache or do a hard refresh (Ctrl+Shift+R)"

