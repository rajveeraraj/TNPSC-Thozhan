# ===================================================
# Stage 1: Build React PWA Frontend
# ===================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ===================================================
# Stage 2: Composer Dependencies for Laravel Backend
# ===================================================
FROM composer:2 AS backend-vendor

WORKDIR /app

COPY backend/composer.json backend/composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --no-scripts \
    --optimize-autoloader

# ===================================================
# Stage 3: Unified Production Runtime (PHP 8.2 + Nginx)
# ===================================================
FROM php:8.2-fpm-alpine

WORKDIR /var/www/html

# Install runtime packages & PHP extensions
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    netcat-openbsd \
    libpng \
    libpng-dev \
    libjpeg-turbo \
    libjpeg-turbo-dev \
    freetype \
    freetype-dev \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    libxml2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        opcache \
    && apk del --no-cache \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        libzip-dev \
        oniguruma-dev \
        icu-dev \
        libxml2-dev

# Copy PHP, Nginx, and Supervisor Configurations
COPY backend/docker/php.ini $PHP_INI_DIR/conf.d/99-custom.ini
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy Laravel Backend Source & Vendor
COPY backend/ /var/www/html
COPY --from=backend-vendor /app/vendor /var/www/html/vendor

# Copy Compiled React PWA Frontend
COPY --from=frontend-builder /app/dist /var/www/frontend

# Set storage and bootstrap cache permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Single port for production (serves both SPA frontend and Laravel backend)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/api/health || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
