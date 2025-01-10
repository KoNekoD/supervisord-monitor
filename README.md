# Supervisord Multi Server Monitoring Tool

![image](https://github.com/KoNekoD/supervisord-monitor/assets/108808201/b069fda7-0a49-4c4a-8b22-50459eb2eebf)

DockerHub: https://hub.docker.com/r/konekod/supervisord-monitor

Telegram: https://t.me/supervisord_monitor

## Features

* Monitor unlimited supervisord servers and processes
* Start/Stop/Restart process
* Read stderr log
* Monitor process uptime status
* Security by password authorization

## How to start

> There are 3 different ways to start. The first is to start by extending a new Dockerfile from the project image and defining the jwt-keys (it may seem complicated, but it is the most reliable and safe). The second is to run via docker-compose with overriding env application parameters and volume for automatically generated keys. And the third option is to just run with env variable definition (the fastest but not the most reliable, jwt key will be recreated uniquely every time).

First let's generate jwt passphrase, we need a random password with a length of 64 characters, as an option use this command:

`tr -dc A-Za-z0-9 </dev/urandom | head -c 64; echo`

### 1. Docker extend

You also need 2 files private.pem and public.pem, you can get them by running the container and copying the automatically generated keys :

```
docker run --detach --name supervisord-monitor -e JWT_PASSPHRASE=your-generated-jwt-passphrase konekod/supervisord-monitor
docker exec --user app -it supervisord-monitor php bin/console lexik:jwt:generate-keypair
docker cp supervisord-monitor:/var/www/supervisord-monitor/config/jwt/private.pem private.pem
docker cp supervisord-monitor:/var/www/supervisord-monitor/config/jwt/public.pem public.pem
docker kill supervisord-monitor
docker rm supervisord-monitor
```

After that, let's create a Dockerfile in a separate directory:

```
FROM konekod/supervisord-monitor:latest  
  
ENV JWT_PASSPHRASE=your-generated-jwt-passphrase  
  
# Generated jwt keys  
COPY private.pem config/jwt/private.pem  
COPY public.pem config/jwt/public.pem  
  
# Please set secure credentials for the administrator account instead default admin admin  
ENV APP_CREDENTIALS='[{"username":"admin","password":"admin","roles":["ROLE_MANAGER"]},{"username":"guest","password":"guest"}]'  
  
# Host on which it is planned to run supervisord-monitor (needed to set cookie authorization)  
ENV API_HOST=localhost  
  
# Your remote suprevisors  
ENV SUPERVISORS_SERVERS=[{"ip":"app-container-frontent","port":9551,"name":"frontent","username":"default","password":"default"},{"ip":"app-container-backend","port":9551,"name":"backend","username":"default","password":"default"}]  
  
# Disable r/w access for project(exclude var dir) for improve security  
USER www-data  
  
```

Final start

```
docker buildx build -t supervisord-monitor-override --load .

docker run --detach --name supervisord-monitor-override -p "10011:8080" supervisord-monitor-override
```

The main trick is that you can close write access to these keys so that you can't change them afterward

### 2. docker-compose

In a specific folder, create docker-compose.yml:
Be sure to create a jwt folder that will become volume manually, otherwise the created folder will have root privileges, which will break key creation(The jwt folder should always be there, it contains the keys)

```
version: "3.8"  
  
name: supervisord-monitor-example  
  
services:  
  supervisord-monitor-app:  
    container_name: supervisord-monitor-app  
    image: konekod/supervisord-monitor  
    environment:  
      - API_HOST=localhost  
      - APP_CREDENTIALS='[{"username":"admin","password":"admin","roles":["ROLE_MANAGER"]},{"username":"guest","password":"guest"}]'  
      - JWT_PASSPHRASE=your-generated-jwt-passphrase  
    volumes:  
      - ./jwt:/var/www/supervisord-monitor/config/jwt:cached  
    ports:  
      - "10011:8080"
```

Here you can also change the mount settings in volume to ro after creation keys.

### 3. Simple run

jwt keys will be generated automatically via supervisor configured program
config/docker/supervisor/supervisord-dist.conf
see program:generate-jwt-if-not-exists

```
docker run \  
  --detach \  
  --name supervisord-monitor \  
  -e APP_CREDENTIALS='[{"username":"admin","password":"admin","roles":["ROLE_MANAGER"]},{"username":"guest","password":"guest"}]' \  
  -e API_HOST=localhost \  
  -e SUPERVISORS_SERVERS=[{"ip":"app-container-frontent","port":9551,"name":"frontent","username":"default","password":"default"},{"ip":"app-container-backend","port":9551,"name":"backend","username":"default","password":"default"}] \  
  konekod/supervisord-monitor
```

## Running via script

With this script it is possible to automatically recreate a container with everything needed

```shell
#!/bin/bash

container_id=$(docker ps | grep my-supervisord-monitor | awk '{ print $1 }')

docker kill "$container_id"
docker rm "$container_id"
docker pull konekod/supervisord-monitor
docker run -d \
  --name my-supervisord-monitor \
  -e SUPERVISORS_SERVERS="$(< /home/dev/supervisord_monitor/supervisord_monitor_servers.json)" \
  -e APP_CREDENTIALS='[{"username":"admin","password":"admin","roles":["ROLE_MANAGER"]},{"username":"guest","password":"guest"}]' \
  -e JWT_PASSPHRASE=your-generated-jwt-passphrase \
  -e API_HOST=supervisord-monitor.site.com \
  -p 10011:8080 \
  --restart=always \
  --network project_network \
  --volume /home/dev/supervisord_monitor/jwt:/var/www/supervisord-monitor/config/jwt:cached \
  konekod/supervisord-monitor:latest
```

## Install

1.Clone supervisord-monitor to your vhost/webroot:

```
git clone git@github.com:KoNekoD/supervisord-monitor.git
```

2.Copy config/docker/.env.dist to config/docker/.env

```
cp config/docker/.env.dist config/docker/.env
```

3.Enable/Uncomment inet_http_server (found in supervisord.conf) for all your supervisord servers.

```ini
[inet_http_server]
port=*:9001
username="yourusername"
password="yourpass"
```

Do not forget to restart supervisord service after changing supervisord.conf

4.Edit supervisord-monitor configuration file and add all your supervisord servers

```
nvim config/docker/.env
```

5.Open web browser and enter your url localhost:$NGINX_HOST_HTTP_PORT,
where $NGINX_HOST_HTTP_PORT must be set in copied .env - custom port

## Troubleshooting

```
Did not receive a '200 OK' response from remote server.
```

Having this messages in most cases means that Supervisord Monitoring tools does not have direct network access to the Supervisord RPC2 http interface. Check your firewall and network conectivity.

But it is possible to get error 500, in that case it is a supervisord-monitor problem, run this command to activate the
profiler.
Where “my-supervisord-monitor-container-name” is the name of your container, please replace with the one you need

```shell
container_id=$(docker ps | grep my-supervisord-monitor-container-name |  awk '{ print $1 }'); docker exec -it --user app $container_id sed -i 's/APP_ENV=prod/APP_ENV=dev/g' .env; docker exec -it --user app $container_id composer install
```

After that try to reproduce the error again and after that you need to share with us the error data from profiler,
trace, error name.
To open it add to URL /profiler, it will be something like “http://localhost:10011/_profiler” and find the 500 error you
need in the profiler.

---

```
Did not receive a '200 OK' response from remote server. (HTTP/1.0 401 Unauthorized)
```

Having `401 Unauthorized` means that you have connection between Supervisord Monitoring tool and Supervisord but the username or password are wrong.

---

```
NO_FILE
```

This error can be seen when reading logs with active flag "redirect_stderr=true", just remove this line, and you will be able to read stderr logs in supervisord-monitor.

---

```
UNKNOWN_METHOD
```

Having this message means that your supervisord service doesn't have rpc interface enabled (only for v3+ of Supervisord).
To enable the rpc interface add this lines to the configuration file:

*From the Supervisord Docs*

In the sample config file, there is a section which is named [rpcinterface:supervisor]. By default, it looks like the
following:

```
[rpcinterface:supervisor]
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface
```

The [rpcinterface:supervisor] section must remain in the configuration for the standard setup of supervisor to work properly.
If you don’t want supervisor to do anything it doesn’t already do out of the box, this is all you need to know about this type of section.

For more information go to the offitial Supervisord Configuration Docs:
http://supervisord.org/configuration.html#rpcinterface-x-section-settings

---

## Star History

![https://api.star-history.com/svg?repos=KoNekoD/supervisord-monitor&type=Date](https://api.star-history.com/svg?repos=KoNekoD/supervisord-monitor&type=Date)

## Who uses Supervisord Monitor?

just me

If you've used Supervisord Monitor Tool send me email to moskva111@yahoo.com to add your project/company to this list.
