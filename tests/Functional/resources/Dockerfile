FROM alpine:latest

RUN apk add bash python3 py3-pip

RUN pip install --break-system-packages supervisor supervisor_twiddler

ARG UID=1000
ARG GID=1000
RUN addgroup -g $GID app && adduser -D -u $UID -G app app && addgroup app www-data

USER app

COPY --chown=app:app . /var/www/supervisord-monitor

WORKDIR /var/www/supervisord-monitor

CMD ["supervisord", "-c", "supervisord.conf"]
