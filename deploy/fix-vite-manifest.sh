#!/bin/bash

# Quick fix script to update app.blade.php on production server
# Run this on your VPS: sudo bash /var/www/hms/current/deploy/fix-vite-manifest.sh

set -e

echo "🔧 Fixing Vite manifest error..."

# Navigate to current deployment
CURRENT_PATH="/var/www/hms/current"
cd "$CURRENT_PATH" || {
    echo "❌ Error: Could not find deployment directory: $CURRENT_PATH"
    exit 1
}

echo "📍 Working directory: $(pwd)"

# Check if app.blade.php exists
if [ ! -f "resources/views/app.blade.php" ]; then
    echo "❌ Error: app.blade.php not found"
    exit 1
fi

# Backup the file
cp resources/views/app.blade.php resources/views/app.blade.php.backup

# Fix the @vite directive
echo "📝 Updating app.blade.php..."
sed -i "s/@vite(\['resources\/js\/app\.tsx', \"resources\/js\/pages\/{\\$page\['component'\]}\.tsx\"\])/@vite(['resources\/js\/app.tsx'])/g" resources/views/app.blade.php

# Verify the change
if grep -q "@vite(\['resources/js/app.tsx'\])" resources/views/app.blade.php; then
    echo "✅ File updated successfully"
else
    echo "⚠️  Warning: Change may not have been applied correctly"
    echo "Current @vite line:"
    grep "@vite" resources/views/app.blade.php || echo "No @vite directive found"
fi

# Clear Laravel caches
echo "🧹 Clearing Laravel caches..."
php artisan view:clear
php artisan config:clear
php artisan cache:clear

# Reload PHP-FPM
echo "🔄 Reloading PHP-FPM..."
sudo systemctl reload php8.3-fpm || sudo systemctl reload php-fpm || echo "⚠️  Could not reload PHP-FPM (may need manual restart)"

echo ""
echo "✅ Fix completed!"
echo ""
echo "The file has been updated. Please refresh your browser to see the changes."
echo "Backup saved at: resources/views/app.blade.php.backup"

