#!/bin/bash

# Script to verify deployment structure and which folder is being served
# Usage: sudo bash deploy/verify-deployment.sh

echo "🔍 Verifying Deployment Structure"
echo "=================================="
echo ""

# Configuration
BASE_PATH="${VPS_DEPLOY_PATH:-/var/www/hms}"
CURRENT_LINK="$BASE_PATH/current"
RELEASES_PATH="$BASE_PATH/releases"

echo "📁 Base Path: $BASE_PATH"
echo ""

# Check if base path exists
if [ ! -d "$BASE_PATH" ]; then
    echo "❌ Base path does not exist: $BASE_PATH"
    exit 1
fi

# Check current symlink
echo "🔗 Checking Current Symlink:"
echo "   Path: $CURRENT_LINK"
if [ -L "$CURRENT_LINK" ]; then
    SYMLINK_TARGET=$(readlink "$CURRENT_LINK")
    SYMLINK_ABS=$(readlink -f "$CURRENT_LINK")
    echo "   ✅ Symlink exists"
    echo "   Target: $SYMLINK_TARGET"
    echo "   Absolute: $SYMLINK_ABS"
    
    if [ -d "$SYMLINK_ABS" ]; then
        echo "   ✅ Target directory exists"
    else
        echo "   ❌ Target directory does not exist!"
    fi
elif [ -d "$CURRENT_LINK" ] && [ ! -L "$CURRENT_LINK" ]; then
    echo "   ⚠️  WARNING: $CURRENT_LINK is a directory, not a symlink!"
    echo "   This should be a symlink pointing to a release directory"
elif [ ! -e "$CURRENT_LINK" ]; then
    echo "   ❌ Symlink does not exist!"
else
    echo "   ❌ Unknown state"
fi
echo ""

# Check NGINX configuration
echo "🌐 Checking NGINX Configuration:"
NGINX_CONFIG=$(sudo nginx -T 2>/dev/null | grep -A 5 "server_name.*hms" | grep "root" | head -1 || echo "")
if [ -n "$NGINX_CONFIG" ]; then
    echo "   Found: $NGINX_CONFIG"
    NGINX_ROOT=$(echo "$NGINX_CONFIG" | grep -oP 'root\s+\K[^;]+' || echo "")
    if [ -n "$NGINX_ROOT" ]; then
        NGINX_ROOT=$(echo "$NGINX_ROOT" | xargs)  # Trim whitespace
        echo "   NGINX root: $NGINX_ROOT"
        
        # Resolve if it's a symlink
        if [[ "$NGINX_ROOT" == *"current"* ]]; then
            RESOLVED=$(readlink -f "$NGINX_ROOT" 2>/dev/null || echo "$NGINX_ROOT")
            echo "   Resolved: $RESOLVED"
        fi
        
        if [ -d "$NGINX_ROOT" ]; then
            echo "   ✅ NGINX root directory exists"
        else
            echo "   ❌ NGINX root directory does not exist!"
        fi
    fi
else
    echo "   ⚠️  Could not find NGINX configuration for HMS"
    echo "   Checking common locations..."
    if [ -f "/etc/nginx/sites-available/hms" ]; then
        echo "   Found: /etc/nginx/sites-available/hms"
        grep "root" /etc/nginx/sites-available/hms | grep -v "^#" | head -1
    fi
fi
echo ""

# Check releases
echo "📦 Checking Releases:"
if [ -d "$RELEASES_PATH" ]; then
    RELEASE_COUNT=$(find "$RELEASES_PATH" -maxdepth 1 -type d -name "20*" | wc -l)
    echo "   Total releases: $RELEASE_COUNT"
    
    if [ "$RELEASE_COUNT" -gt 0 ]; then
        echo "   Recent releases:"
        find "$RELEASES_PATH" -maxdepth 1 -type d -name "20*" | sort -r | head -5 | while read -r release; do
            RELEASE_NAME=$(basename "$release")
            if [ "$(readlink -f "$release")" == "$(readlink -f "$CURRENT_LINK" 2>/dev/null)" ]; then
                echo "   → $RELEASE_NAME (CURRENT)"
            else
                echo "     $RELEASE_NAME"
            fi
        done
    else
        echo "   ⚠️  No releases found"
    fi
else
    echo "   ❌ Releases directory does not exist: $RELEASES_PATH"
fi
echo ""

# Check current deployment
if [ -L "$CURRENT_LINK" ]; then
    CURRENT_DEPLOY=$(readlink -f "$CURRENT_LINK")
    echo "📂 Current Deployment Details:"
    echo "   Path: $CURRENT_DEPLOY"
    
    if [ -d "$CURRENT_DEPLOY" ]; then
        echo "   ✅ Directory exists"
        
        # Check key files
        echo ""
        echo "   📄 Key Files:"
        [ -f "$CURRENT_DEPLOY/composer.json" ] && echo "   ✅ composer.json" || echo "   ❌ composer.json missing"
        [ -f "$CURRENT_DEPLOY/artisan" ] && echo "   ✅ artisan" || echo "   ❌ artisan missing"
        [ -f "$CURRENT_DEPLOY/.env" ] && echo "   ✅ .env" || echo "   ⚠️  .env (may be in shared)"
        
        # Check build files
        echo ""
        echo "   🎨 Build Files:"
        if [ -f "$CURRENT_DEPLOY/public/build/manifest.json" ]; then
            echo "   ✅ manifest.json exists"
            MANIFEST_SIZE=$(stat -c%s "$CURRENT_DEPLOY/public/build/manifest.json" 2>/dev/null || echo "0")
            echo "   Size: $MANIFEST_SIZE bytes"
            
            # Check for Welcome page in manifest
            if grep -q "Welcome" "$CURRENT_DEPLOY/public/build/manifest.json" 2>/dev/null; then
                echo "   ✅ Welcome.tsx found in manifest"
            else
                echo "   ⚠️  Welcome.tsx not found in manifest (may be bundled)"
            fi
            
            # List build files
            echo ""
            echo "   Build assets:"
            ls -lh "$CURRENT_DEPLOY/public/build/assets/" 2>/dev/null | head -5 | awk '{print "     "$9" ("$5")"}'
        else
            echo "   ❌ manifest.json missing!"
            echo "   Build files may not be present"
        fi
        
        # Check public directory
        echo ""
        echo "   🌐 Public Directory:"
        if [ -d "$CURRENT_DEPLOY/public" ]; then
            echo "   ✅ public/ exists"
            [ -f "$CURRENT_DEPLOY/public/index.php" ] && echo "   ✅ index.php" || echo "   ❌ index.php missing"
        else
            echo "   ❌ public/ directory missing!"
        fi
        
        # Check permissions
        echo ""
        echo "   🔐 Permissions:"
        OWNER=$(stat -c '%U:%G' "$CURRENT_DEPLOY" 2>/dev/null || echo "unknown")
        PERMS=$(stat -c '%a' "$CURRENT_DEPLOY" 2>/dev/null || echo "unknown")
        echo "   Owner: $OWNER"
        echo "   Permissions: $PERMS"
    else
        echo "   ❌ Directory does not exist!"
    fi
fi
echo ""

# Check what's actually being served
echo "🔍 What's Actually Being Served:"
if [ -L "$CURRENT_LINK" ]; then
    SERVED_PATH=$(readlink -f "$CURRENT_LINK/public" 2>/dev/null)
    if [ -d "$SERVED_PATH" ]; then
        echo "   Path: $SERVED_PATH"
        
        # Check if this matches NGINX config
        if [ -n "$NGINX_ROOT" ]; then
            NGINX_RESOLVED=$(readlink -f "$NGINX_ROOT" 2>/dev/null || echo "$NGINX_ROOT")
            if [ "$SERVED_PATH" == "$NGINX_RESOLVED" ]; then
                echo "   ✅ Matches NGINX configuration"
            else
                echo "   ⚠️  Does NOT match NGINX configuration!"
                echo "   NGINX serves: $NGINX_RESOLVED"
            fi
        fi
        
        # Check build files in served path
        if [ -f "$SERVED_PATH/build/manifest.json" ]; then
            echo "   ✅ Build files present in served path"
            MANIFEST_DATE=$(stat -c '%y' "$SERVED_PATH/build/manifest.json" 2>/dev/null | cut -d' ' -f1,2 | cut -d'.' -f1)
            echo "   Manifest date: $MANIFEST_DATE"
        else
            echo "   ❌ Build files NOT present in served path!"
        fi
    fi
fi
echo ""

# Summary
echo "📊 Summary:"
echo "============"
ISSUES=0

if [ ! -L "$CURRENT_LINK" ]; then
    echo "❌ Current symlink is missing or invalid"
    ISSUES=$((ISSUES + 1))
fi

if [ -L "$CURRENT_LINK" ] && [ ! -d "$(readlink -f "$CURRENT_LINK")" ]; then
    echo "❌ Current symlink points to non-existent directory"
    ISSUES=$((ISSUES + 1))
fi

if [ -L "$CURRENT_LINK" ] && [ ! -f "$(readlink -f "$CURRENT_LINK")/public/build/manifest.json" ]; then
    echo "❌ Build files missing in current deployment"
    ISSUES=$((ISSUES + 1))
fi

if [ $ISSUES -eq 0 ]; then
    echo "✅ Deployment structure looks correct!"
    echo ""
    echo "💡 To verify in browser:"
    echo "   1. Open browser DevTools (F12)"
    echo "   2. Check Network tab"
    echo "   3. Look for app-*.js file"
    echo "   4. Check the file name matches what's in public/build/assets/"
else
    echo "⚠️  Found $ISSUES issue(s) that need attention"
fi
echo ""

