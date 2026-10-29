#!/bin/sh
set -e

echo "Starting TNPSC தோழன் Unified Production Container..."

# Ensure proper storage permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Generate APP_KEY if missing
if [ -z "$APP_KEY" ]; then
    echo "Generating Laravel APP_KEY..."
    cd /var/www/html && php artisan key:generate --force
fi

# Wait for MySQL if configured
if [ "$DB_CONNECTION" = "mysql" ] && [ -n "$DB_HOST" ]; then
    echo "Waiting for database connection at $DB_HOST:${DB_PORT:-3306}..."
    until nc -z -v -w30 "$DB_HOST" "${DB_PORT:-3306}"; do
        echo "Waiting for database..."
        sleep 2
    done
    echo "Database connected!"
fi

# Run migrations
echo "Running database migrations..."
cd /var/www/html && php artisan migrate --force

# Seed database if DB_SEED_ON_START is true
if [ "$DB_SEED_ON_START" = "true" ]; then
    echo "Seeding initial authentic dataset..."
    cd /var/www/html && php artisan db:seed --force
fi

# Cache configuration, routes, and views for maximum production throughput
echo "Caching Laravel configuration, routes, and views..."
cd /var/www/html && php artisan config:cache
cd /var/www/html && php artisan route:cache
cd /var/www/html && php artisan view:cache

echo "Unified Container ready. Launching Nginx and PHP-FPM via Supervisor..."
exec "$@"
