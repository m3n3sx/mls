#!/bin/bash

echo "🧪 Running WordPress environment tests..."

# Check if containers are running
if ! docker ps | grep -q mase_wordpress; then
    echo "❌ WordPress container is not running. Run ./docker-setup.sh first"
    exit 1
fi

echo "✅ Containers are running"

# Check WordPress installation
if docker exec mase_wordpress wp core is-installed --allow-root 2>/dev/null; then
    echo "✅ WordPress is installed"
else
    echo "❌ WordPress is not installed"
    exit 1
fi

# Check plugin status
PLUGIN_STATUS=$(docker exec mase_wordpress wp plugin status modern-admin-styler --allow-root 2>/dev/null)
if echo "$PLUGIN_STATUS" | grep -q "Active"; then
    echo "✅ Modern Admin Styler plugin is active"
else
    echo "❌ Modern Admin Styler plugin is not active"
    echo "$PLUGIN_STATUS"
fi

# Check for PHP errors
echo ""
echo "📋 Recent PHP errors (if any):"
docker exec mase_wordpress tail -20 /var/www/html/wp-content/debug.log 2>/dev/null || echo "No errors found"

echo ""
echo "🌐 Access the site at: http://localhost:8080/wp-admin"
