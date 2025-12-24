#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Get the directory where the script is located
DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DEPLOY_DIR"

# Check if .env file exists, create from .env.example if it doesn't
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    if [ -f .env.example ]; then
        echo "📋 Copying .env.example to .env..."
        cp .env.example .env
        echo "✅ Created .env file from .env.example"
    else
        echo "⚠️  .env.example not found, creating minimal .env file..."
        cat > .env << 'EOF'
APP_NAME=HMS
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hms
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
EOF
        echo "✅ Created minimal .env file"
    fi
    echo ""
    echo "⚠️  IMPORTANT: You must configure your .env file!"
    echo "   Required values:"
    echo "   - APP_KEY (will be generated automatically if missing)"
    echo "   - DB_CONNECTION=mysql"
    echo "   - DB_DATABASE=your_database_name"
    echo "   - DB_USERNAME=your_database_user"
    echo "   - DB_PASSWORD=your_database_password"
    echo "   - APP_URL=your_domain_or_ip"
    echo ""
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Generate APP_KEY if it's missing
if [ -z "$APP_KEY" ] || [ "$APP_KEY" == "" ]; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force
    # Reload environment variables after key generation
    export $(cat .env | grep -v '^#' | xargs)
fi

# Verify database connection is set to MySQL
DB_CONFIGURED=true
if [ -z "$DB_CONNECTION" ] || [ "$DB_CONNECTION" != "mysql" ]; then
    echo "⚠️  Warning: DB_CONNECTION is not set to 'mysql'"
    echo "Current value: ${DB_CONNECTION:-'not set'}"
    echo "For production, DB_CONNECTION should be set to 'mysql' in your .env file"
    DB_CONFIGURED=false
fi

# Check if database credentials are set
if [ -z "$DB_DATABASE" ] || [ "$DB_DATABASE" == "" ] || [ "$DB_DATABASE" == "hms" ]; then
    echo "⚠️  Warning: DB_DATABASE appears to be using default value"
    DB_CONFIGURED=false
fi

if [ "$DB_CONFIGURED" = false ]; then
    echo ""
    echo "⚠️  Database may not be configured correctly. Migration will be attempted but may fail."
    echo ""
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

# Run migrations (skip if database is not configured)
echo "🗄️  Running database migrations..."
set +e  # Temporarily disable exit on error for migration
php artisan migrate --force
MIGRATION_EXIT_CODE=$?
set -e  # Re-enable exit on error

if [ $MIGRATION_EXIT_CODE -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo ""
    echo "⚠️  Migration failed (exit code: $MIGRATION_EXIT_CODE)"
    echo ""
    echo "This is expected if:"
    echo "  - Database is not yet configured in .env"
    echo "  - Database server is not running"
    echo "  - Database credentials are incorrect"
    echo ""
    echo "To fix, ensure your .env file has:"
    echo "  - DB_CONNECTION=mysql"
    echo "  - DB_HOST=127.0.0.1 (or your MySQL host)"
    echo "  - DB_PORT=3306"
    echo "  - DB_DATABASE=your_actual_database_name"
    echo "  - DB_USERNAME=your_database_user"
    echo "  - DB_PASSWORD=your_database_password"
    echo ""
    echo "⚠️  Continuing with other deployment steps..."
fi

# Clear and cache configuration
echo "⚙️  Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Clear application cache
php artisan cache:clear

echo "✅ Deployment completed successfully!"

