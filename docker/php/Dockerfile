FROM php:8.2-fpm

# Instalar dependencias del sistema y extensiones de PHP necesarias
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    libzip-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql gd zip

# Instalar Composer (lo necesitaremos para Symfony)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
