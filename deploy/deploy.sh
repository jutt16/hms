#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Get the directory where the script is located
DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DEPLOY_DIR"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your database configuration."
    echo "Required variables:"
    echo "  - DB_CONNECTION=mysql"
    echo "  - DB_HOST=127.0.0.1"
    echo "  - DB_PORT=3306"
    echo "  - DB_DATABASE=your_database_name"
    echo "  - DB_USERNAME=your_database_user"
    echo "  - DB_PASSWORD=your_database_password"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Verify database connection is set to MySQL
if [ -z "$DB_CONNECTION" ] || [ "$DB_CONNECTION" != "mysql" ]; then
    echo "⚠️  Warning: DB_CONNECTION is not set to 'mysql'"
    echo "Current value: ${DB_CONNECTION:-'not set'}"
    echo "For production, DB_CONNECTION should be set to 'mysql' in your .env file"
    echo ""
    echo "Continuing with migration attempt..."
fi

# Install Composer dependencies (production only)
echo "📦 Installing Composer dependencies..."
# Remove old vendor directory if it exists to ensure clean install
if [ -d "vendor" ]; then
    rm -rf vendor
fi
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Set proper permissions
echo "🔐 Setting permissions..."
chmod -R 775 storage bootstrap/cache

# Run migrations
echo "🗄️  Running database migrations..."
if ! php artisan migrate --force; then
    echo ""
    echo "❌ Migration failed!"
    echo ""
    echo "Common issues:"
    echo "  1. Database connection not configured correctly in .env"
    echo "  2. Database server not running"
    echo "  3. Database credentials incorrect"
    echo "  4. Database does not exist"
    echo ""
    echo "Please check your .env file and ensure:"
    echo "  - DB_CONNECTION=mysql (not sqlite)"
    echo "  - DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD are correct"
    echo ""
    exit 1
fi

# Clear and cache configuration
echo "⚙️  Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Clear application cache
php artisan cache:clear

echo "✅ Deployment completed successfully!"

