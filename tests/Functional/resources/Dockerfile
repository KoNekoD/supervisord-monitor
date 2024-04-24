FROM alpine:latest

RUN apk add bash python3 py3-pip

ARG UID=1000
ARG GID=1000
RUN addgroup -g $GID app && adduser -D -u $UID -G app app && addgroup app www-data

USER app

COPY --chown=app:app . /var/www/supervisor-monitor

WORKDIR /var/www/supervisor-monitor

CMD ["/bin/sh", "run_supervisord.sh"]
