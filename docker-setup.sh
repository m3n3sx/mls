#!/bin/bash

echo "🚀 Starting WordPress with Modern Admin Styler plugin..."

# Start Docker containers
docker-compose up -d

echo "⏳ Waiting for WordPress to be ready..."
sleep 15

# Wait for WordPress to be fully initialized
until docker exec mase_wordpress wp core is-installed --allow-root 2>/dev/null; do
    echo "⏳ WordPress is still initializing..."
    sleep 5
done

echo "✅ WordPress is ready!"

# Install WordPress if not already installed
docker exec mase_wordpress wp core install \
    --url="http://localhost:8080" \
    --title="MASE Test Site" \
    --admin_user="admin" \
    --admin_password="admin" \
    --admin_email="admin@example.com" \
    --skip-email \
    --allow-root 2>/dev/null || echo "WordPress already installed"

# Activate the plugin
echo "🔌 Activating Modern Admin Styler plugin..."
docker exec mase_wordpress wp plugin activate modern-admin-styler --allow-root

# Set proper permissions
docker exec mase_wordpress chown -R www-data:www-data /var/www/html/wp-content/plugins/modern-admin-styler

echo ""
echo "✅ Setup complete!"
echo ""
echo "📍 WordPress URL: http://localhost:8080"
echo "👤 Admin URL: http://localhost:8080/wp-admin"
echo "🔑 Username: admin"
echo "🔑 Password: admin"
echo ""
echo "🔧 Plugin settings: http://localhost:8080/wp-admin/admin.php?page=modern-admin-styler"
echo ""
echo "To stop: docker-compose down"
echo "To view logs: docker-compose logs -f wordpress"
