#!/bin/sh
set -e

echo "Starting TNPSC தோழன் Backend Production Entrypoint..."

# Ensure proper permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Generate APP_KEY if missing
if [ -z "$APP_KEY" ]; then
    echo "APP_KEY is missing, generating one..."
    php artisan key:generate --force
fi

# Wait for MySQL database if DB_HOST is set
if [ "$DB_CONNECTION" = "mysql" ] && [ -n "$DB_HOST" ]; then
    echo "Waiting for MySQL database ($DB_HOST:${DB_PORT:-3306}) to become ready..."
    until nc -z -v -w30 "$DB_HOST" "${DB_PORT:-3306}"; do
        echo "Waiting for database connection..."
        sleep 2
    done
    echo "Database is ready!"
fi

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Run initial seeder if DB_SEED_ON_START is set to true
if [ "$DB_SEED_ON_START" = "true" ]; then
    echo "Seeding initial authentic question bank and default users..."
    php artisan db:seed --force
fi

# Optimize Laravel caching for production performance
echo "Caching Laravel configuration, routes, and views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "TNPSC தோழன் Backend initialization complete. Starting Supervisor..."
exec "$@"
