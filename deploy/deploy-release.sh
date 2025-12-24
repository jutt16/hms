#!/bin/bash

# Deployment script for Laravel application with release management
# This script handles atomic deployments with proper rollback capability

set -e

# Configuration
BASE_PATH="${VPS_DEPLOY_PATH:-/var/www/hms}"
RELEASES_PATH="$BASE_PATH/releases"
CURRENT_LINK="$BASE_PATH/current"
SHARED_PATH="$BASE_PATH/shared"
RELEASE_NAME="$(date +%Y%m%d-%H%M%S)"
RELEASE_PATH="$RELEASES_PATH/$RELEASE_NAME"
DEPLOYMENT_ARCHIVE="/tmp/hms.tar.gz"
KEEP_RELEASES=3

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Error handler
cleanup_on_error() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        log_error "Deployment failed with exit code $exit_code"
        log_warn "Cleaning up failed release: $RELEASE_PATH"
        sudo rm -rf "$RELEASE_PATH" 2>/dev/null || true
        log_info "If you need to rollback, run: sudo ln -sfn $RELEASES_PATH/<previous-release> $CURRENT_LINK"
    fi
    exit $exit_code
}

trap cleanup_on_error ERR INT TERM

# Verify deployment archive exists
if [ ! -f "$DEPLOYMENT_ARCHIVE" ]; then
    log_error "Deployment archive not found: $DEPLOYMENT_ARCHIVE"
    exit 1
fi

log_info "Starting deployment: $RELEASE_NAME"

# Create necessary directories
log_info "Creating directory structure..."
sudo mkdir -p "$RELEASES_PATH"
sudo mkdir -p "$SHARED_PATH"
sudo mkdir -p "$RELEASE_PATH"

# Extract deployment archive
log_info "Extracting deployment archive..."
sudo tar -xzf "$DEPLOYMENT_ARCHIVE" -C "$RELEASE_PATH" --strip-components=0

# Verify extraction was successful
if [ ! -f "$RELEASE_PATH/composer.json" ]; then
    log_error "Extraction failed - composer.json not found in release"
    exit 1
fi

# Set proper ownership
log_info "Setting file ownership (www-data:www-data)..."
sudo chown -R www-data:www-data "$RELEASE_PATH"

# Set proper permissions
log_info "Setting file permissions..."
sudo chmod -R 755 "$RELEASE_PATH"
sudo chmod -R 775 "$RELEASE_PATH/storage" "$RELEASE_PATH/bootstrap/cache" 2>/dev/null || true

# Link shared directories (storage, .env)
log_info "Linking shared directories..."
if [ -d "$SHARED_PATH/storage" ]; then
    sudo rm -rf "$RELEASE_PATH/storage"
    sudo ln -sfn "$SHARED_PATH/storage" "$RELEASE_PATH/storage"
else
    # First deployment - move storage to shared
    sudo mkdir -p "$SHARED_PATH/storage"
    sudo mv "$RELEASE_PATH/storage"/* "$SHARED_PATH/storage/" 2>/dev/null || true
    sudo rmdir "$RELEASE_PATH/storage" 2>/dev/null || true
    sudo ln -sfn "$SHARED_PATH/storage" "$RELEASE_PATH/storage"
fi

# Link .env file if it exists in shared
if [ -f "$SHARED_PATH/.env" ]; then
    sudo ln -sfn "$SHARED_PATH/.env" "$RELEASE_PATH/.env"
    log_info "Linked shared .env file"
elif [ -f "$BASE_PATH/.env" ]; then
    # Fallback to base path .env
    sudo ln -sfn "$BASE_PATH/.env" "$RELEASE_PATH/.env"
    log_info "Linked base .env file"
else
    log_warn ".env file not found - application may not work correctly"
fi

# Run deployment script if it exists
if [ -f "$RELEASE_PATH/deploy/deploy.sh" ]; then
    log_info "Running deployment script..."
    cd "$RELEASE_PATH"
    sudo chmod +x deploy/deploy.sh
    sudo -u www-data bash deploy/deploy.sh || {
        log_error "Deployment script failed"
        exit 1
    }
else
    log_warn "No deploy/deploy.sh found, skipping custom deployment steps"
fi

# Run database migrations
log_info "Running database migrations..."
cd "$RELEASE_PATH"
sudo -u www-data php artisan migrate --force || {
    log_error "Database migrations failed"
    exit 1
}

# Optimize Laravel
log_info "Optimizing Laravel application..."
sudo -u www-data php artisan config:cache || log_warn "Config cache failed"
sudo -u www-data php artisan route:cache || log_warn "Route cache failed"
sudo -u www-data php artisan view:cache || log_warn "View cache failed"

# Atomically update current symlink
log_info "Updating current symlink atomically..."
# Remove any existing broken symlinks, temp files, or directory
sudo rm -f "$CURRENT_LINK.new" "$CURRENT_LINK.tmp" 2>/dev/null || true
# Remove existing symlink if it exists (including if it points to current.new)
if [ -L "$CURRENT_LINK" ] || [ -e "$CURRENT_LINK" ]; then
    sudo rm -f "$CURRENT_LINK"
fi
# If current exists as a directory, remove it (shouldn't happen, but handle it)
if [ -d "$CURRENT_LINK" ] && [ ! -L "$CURRENT_LINK" ]; then
    log_warn "$CURRENT_LINK exists as a directory, removing it..."
    sudo rm -rf "$CURRENT_LINK"
fi
# Create symlink directly (no need for temp file since we removed the old one)
sudo ln -sfn "$RELEASE_PATH" "$CURRENT_LINK"

# Verify symlink is correct
if [ ! -L "$CURRENT_LINK" ]; then
    log_error "Symlink does not exist: $CURRENT_LINK"
    ls -la "$BASE_PATH" | grep -E "(current|releases)" || true
    exit 1
fi

# Resolve both paths to absolute and compare
CURRENT_ABS=$(readlink -f "$CURRENT_LINK" 2>/dev/null || echo "")
RELEASE_ABS=$(readlink -f "$RELEASE_PATH" 2>/dev/null || echo "")

if [ -z "$CURRENT_ABS" ] || [ -z "$RELEASE_ABS" ]; then
    log_error "Could not resolve symlink paths"
    log_error "Current absolute: $CURRENT_ABS"
    log_error "Release absolute: $RELEASE_ABS"
    ls -la "$CURRENT_LINK" || true
    exit 1
fi

if [ "$CURRENT_ABS" != "$RELEASE_ABS" ]; then
    log_error "Symlink verification failed"
    log_error "Current symlink points to: $CURRENT_ABS"
    log_error "Expected to point to: $RELEASE_ABS"
    ls -la "$CURRENT_LINK" || true
    exit 1
fi

log_info "Symlink updated successfully: $CURRENT_LINK -> $RELEASE_PATH"

# Reload NGINX to pick up new release
log_info "Reloading NGINX..."
if sudo nginx -t > /dev/null 2>&1; then
    sudo systemctl reload nginx || {
        log_warn "NGINX reload failed, but deployment succeeded"
    }
    log_info "NGINX reloaded successfully"
else
    log_error "NGINX configuration test failed"
    exit 1
fi

# Clean up old releases (keep last 3)
log_info "Cleaning up old releases (keeping last $KEEP_RELEASES)..."
RELEASE_COUNT=$(sudo find "$RELEASES_PATH" -maxdepth 1 -type d -name "20*" | wc -l)
if [ "$RELEASE_COUNT" -gt "$KEEP_RELEASES" ]; then
    OLD_RELEASES=$(sudo find "$RELEASES_PATH" -maxdepth 1 -type d -name "20*" | sort | head -n -$KEEP_RELEASES)
    if [ -n "$OLD_RELEASES" ]; then
        echo "$OLD_RELEASES" | while read -r old_release; do
            # Don't delete if it's the current release
            if [ "$(readlink -f "$old_release")" != "$(readlink -f "$CURRENT_LINK")" ]; then
                log_info "Removing old release: $(basename "$old_release")"
                sudo rm -rf "$old_release"
            fi
        done
    fi
    log_info "Kept last $KEEP_RELEASES releases"
else
    log_info "Only $RELEASE_COUNT release(s) found, no cleanup needed"
fi

# Clean up deployment archive
log_info "Cleaning up deployment archive..."
sudo rm -f "$DEPLOYMENT_ARCHIVE"

log_info "✅ Deployment completed successfully!"
log_info "Release: $RELEASE_NAME"
log_info "Path: $RELEASE_PATH"
log_info "Current symlink: $CURRENT_LINK -> $RELEASE_PATH"

