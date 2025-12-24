# Deployment Improvements Summary

This document outlines the improvements made to the deployment workflow to address the issues with symlink updates and ensure reliable, automated deployments.

## Problems Addressed

1. ✅ **Symlink Update Issues**: The `current` symlink was not being updated correctly, causing NGINX to serve old releases
2. ✅ **No NGINX Reload**: NGINX wasn't being reloaded after deployment
3. ✅ **Release Management**: Changed from keeping 5 releases to 3 releases
4. ✅ **Error Handling**: Added proper error handling and rollback capability
5. ✅ **Atomic Updates**: Implemented atomic symlink updates to prevent serving old releases

## New Features

### 1. Release-Based Deployment (`deploy/deploy-release.sh`)

A new comprehensive deployment script that handles:

- **Atomic Symlink Updates**: Creates symlink in temporary location, then atomically moves it
- **Error Handling**: Automatic cleanup of failed deployments
- **Shared Directories**: Support for shared storage and .env files
- **NGINX Reload**: Automatically reloads NGINX after successful deployment
- **Release Cleanup**: Keeps only the last 3 releases
- **Proper Permissions**: Sets correct ownership (`www-data:www-data`) and permissions

### 2. Updated GitHub Actions Workflows

Both `.github/workflows/deploy.yml` and `.github/workflows/ci-cd.yml` have been updated to:

- Use the new `deploy-release.sh` script when available
- Fall back to inline deployment script if `deploy-release.sh` is not in the archive
- Run database migrations after deployment
- Reload NGINX after successful deployment
- Keep only the last 3 releases (instead of 5)
- Verify symlink updates before proceeding
- Clean up temporary files

### 3. Improved `deploy/deploy.sh`

Updated to remove redundant migration steps (now handled by main deployment script) and focus on application-specific deployment tasks.

## Deployment Flow

1. **Create Release Directory**: `/var/www/hms/releases/YYYYMMDD-HHMMSS`
2. **Extract Archive**: Extract deployment package to release directory
3. **Set Permissions**: Set ownership to `www-data:www-data` and proper file permissions
4. **Link Shared Resources**: Link shared storage and .env if they exist
5. **Run Optional Script**: Execute `deploy/deploy.sh` if present
6. **Run Migrations**: Execute `php artisan migrate --force`
7. **Optimize Laravel**: Cache config, routes, and views
8. **Update Symlink**: Atomically update `current` symlink to new release
9. **Reload NGINX**: Reload NGINX to serve the new release
10. **Cleanup**: Remove old releases (keep last 3) and temporary files

## Directory Structure

```
/var/www/hms/
├── current -> releases/20241215-143022  (symlink)
├── releases/
│   ├── 20241215-120000/
│   ├── 20241215-130000/
│   └── 20241215-143022/  (latest)
└── shared/  (optional, for shared storage and .env)
    ├── storage/
    └── .env
```

## Rollback Procedure

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

## Requirements Met

✅ **Keep all releases in `/var/www/hms/releases/YYYYMMDD-HHMMSS`**  
✅ **Create or update `/var/www/hms/current` as a symlink to the latest release**  
✅ **Ensure NGINX serves `/var/www/hms/current/public`**  
✅ **Keep the last 3 releases for potential rollback**  
✅ **Correctly handle file ownership (`www-data:www-data`) and permissions**  
✅ **Run database migrations using `php artisan migrate --force` after deployment**  
✅ **Optionally run any `deploy/deploy.sh` script in the new release**  
✅ **Clean up temporary deployment files like `hms.tar.gz`**  
✅ **Reload NGINX if needed to pick up the new release**

## Testing the Deployment

After pushing to the main/master branch, the GitHub Actions workflow will:

1. Run tests and linting
2. Build assets
3. Create deployment package
4. Upload to VPS
5. Execute deployment using `deploy-release.sh`
6. Verify deployment success

Check the GitHub Actions logs to monitor the deployment process.

## Troubleshooting

### Symlink Not Updating

If the symlink is not updating correctly:

```bash
# Check current symlink
ls -la /var/www/hms/current

# Manually update if needed
sudo ln -sfn /var/www/hms/releases/YYYYMMDD-HHMMSS /var/www/hms/current
sudo nginx -t && sudo systemctl reload nginx
```

### NGINX Not Reloading

If NGINX fails to reload:

```bash
# Test NGINX configuration
sudo nginx -t

# Check NGINX status
sudo systemctl status nginx

# Manually reload
sudo systemctl reload nginx
```

### Migration Failures

If migrations fail, the deployment will stop and the failed release will be cleaned up automatically. Check:

1. Database connection in `.env`
2. Database user permissions
3. Database server status

### Permission Issues

If you encounter permission issues:

```bash
sudo chown -R www-data:www-data /var/www/hms/releases
sudo chmod -R 755 /var/www/hms/releases
sudo chmod -R 775 /var/www/hms/releases/*/storage
sudo chmod -R 775 /var/www/hms/releases/*/bootstrap/cache
```

