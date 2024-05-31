FROM php:8.3-fpm-alpine as parent-railgun-php-fpm

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY assets/package.json /var/www/supervisor-monitor/assets/package.json

RUN set -eux && \
    chmod +x /usr/local/bin/install-php-extensions && sync && install-php-extensions intl zip && \
    apk add --no-cache curl git nginx openssh npm yarn supervisor && \
    npm install -g corepack && corepack enable && \
    cd /var/www/supervisor-monitor/assets && yarn set version from sources && \
    mkdir -p /var/log/supervisor /etc/supervisor/conf.d/ && \
    rm -rf /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf /var/cache/apk/*

ARG BUILD_TYPE="dist"
ARG DEV_HOST_IP=172.18.3.1
ARG DEV_XDEBUG_AUTOSTART=trigger
ARG DEV_XDEBUG_IDE_KEY=PHPSTORM
ARG PHP_IDE_CONFIG="serverName=Docker"
ENV PHP_IDE_CONFIG=$PHP_IDE_CONFIG

RUN if [ "$BUILD_TYPE" = "dev" ]; then \
      install-php-extensions gd xdebug && \
      touch /var/log/xdebug.log && chmod 0666 /var/log/xdebug.log && \
      echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
      echo "xdebug.start_with_request=$DEV_XDEBUG_AUTOSTART" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
      echo "xdebug.client_host=$DEV_HOST_IP" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
      echo "xdebug.client_port=9003" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
      echo "xdebug.log=/var/log/xdebug.log" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
      echo "xdebug.idekey=$DEV_XDEBUG_IDE_KEY" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
      curl -1sLf 'https://dl.cloudsmith.io/public/symfony/stable/setup.alpine.sh' | /bin/sh; \
      apk add --no-cache symfony-cli ranger vim nano vifm; \
  fi;

COPY ./config/docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./config/docker/nginx/${BUILD_TYPE}/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY ./config/docker/supervisor/supervisord-${BUILD_TYPE}.conf /etc/supervisord.conf
COPY ./config/docker/php/php.ini /usr/local/etc/php/php.ini
COPY ./config/docker/php/conf.d/*.ini /usr/local/etc/php/conf.d/
COPY ./config/docker/php/fpm-conf.d/*.conf /usr/local/etc/php-fpm.d/

ARG PUID=1000
ARG PGID=1000
RUN addgroup -g $PGID app && adduser -D -u $PUID -G app app && addgroup app www-data
USER app
COPY --chown=app:app . /var/www/supervisor-monitor
WORKDIR /var/www/supervisor-monitor

RUN if [ "${BUILD_TYPE}" = "dist" ]; then \
      cd assets && npm install && npm run build && rm -r node_modules && cd ../ && \
      composer install --no-dev && chmod -R g+w var && chgrp -R www-data var && \
      rm -rf /home/app/.npm /home/app/.composer; \
    fi;

USER www-data

EXPOSE 8080

ARG SUPERVISORS_SERVERS=[]
ENV SUPERVISORS_SERVERS=$SUPERVISORS_SERVERS

CMD ["supervisord"]
