FROM php:8.4-cli-alpine

WORKDIR /app

RUN apk add --no-cache bash curl git icu-dev libzip-dev oniguruma-dev zip unzip \
    && docker-php-ext-install pdo_mysql bcmath zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-dev --prefer-dist --optimize-autoloader --no-scripts

COPY . .
RUN composer dump-autoload --optimize

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
