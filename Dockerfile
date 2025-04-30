FROM registry.gitlab.com/sdt7772416/infrastructure/node-alpha:latest AS build-frontend

COPY assets/ /app
WORKDIR /app
RUN corepack enable && yarn set version from sources && yarn --immutable && yarn install && yarn build

FROM php:8.3-fpm-alpine AS parent-supervisord-monitor-php-fpm

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

ARG PUID=1000
ARG PGID=1000
ARG BUILD_TYPE="dist"
ARG DEV_HOST_IP=172.18.3.1
ARG DEV_XDEBUG_AUTOSTART=trigger
ARG DEV_XDEBUG_IDE_KEY=PHPSTORM
ARG PHP_IDE_CONFIG="serverName=Docker"

RUN set -eux && \
    chmod +x /usr/local/bin/install-php-extensions && sync && install-php-extensions @composer intl zip && \
    apk add --no-cache curl git nginx openssh supervisor && \
    if [ "${BUILD_TYPE}" = "dev" ]; then \
        curl -1sLf 'https://dl.cloudsmith.io/public/symfony/stable/setup.alpine.sh' | /bin/sh; \
        apk add --no-cache symfony-cli ranger vim nano vifm npm yarn && npm install -g corepack && corepack enable && \
        install-php-extensions gd xdebug && touch /var/log/xdebug.log && chmod 0666 /var/log/xdebug.log && \
        echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
        echo "xdebug.start_with_request=$DEV_XDEBUG_AUTOSTART" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
        echo "xdebug.client_host=$DEV_HOST_IP" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
        echo "xdebug.client_port=9003" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
        echo "xdebug.log=/var/log/xdebug.log" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
        echo "xdebug.idekey=$DEV_XDEBUG_IDE_KEY" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
    fi && \
    mkdir -p /var/log/supervisor /etc/supervisor/conf.d/ && \
    rm -rf /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf /var/cache/apk/* && \
    addgroup -g $PGID app && adduser -D -u $PUID -G app app && addgroup app www-data

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/nginx/${BUILD_TYPE}/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY ./docker/supervisor/supervisord-${BUILD_TYPE}.conf /etc/supervisord.conf
COPY ./docker/php/php.ini /usr/local/etc/php/php.ini
COPY ./docker/php/conf.d/*.ini /usr/local/etc/php/conf.d/
COPY ./docker/php/fpm-conf.d/*.conf /usr/local/etc/php-fpm.d/
USER app
COPY --chown=app:app . /var/www/supervisord-monitor
COPY --from=build-frontend /app/dist /var/www/supervisord-monitor/assets/dist
WORKDIR /var/www/supervisord-monitor

RUN if [ "${BUILD_TYPE}" = "dev" ]; then cd assets && yarn set version from sources; fi && \
    if [ "${BUILD_TYPE}" = "dist" ]; then \
      composer install --no-dev && \
      chmod -R g+w var && chgrp -R www-data var && mkdir config/jwt && rm -rf /home/app/.npm /home/app/.composer; \
    fi;

EXPOSE 8080

CMD ["supervisord"]
