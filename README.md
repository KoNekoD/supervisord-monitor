# Supervisord Multi Server Monitoring Tool

![image](https://github.com/KoNekoD/supervisord-monitor/assets/108808201/b069fda7-0a49-4c4a-8b22-50459eb2eebf)

DockerHub: https://hub.docker.com/r/konekod/supervisord-monitor

Telegram: https://t.me/supervisord_monitor

## Features

* Monitor unlimited supervisord servers and processes
* Start/Stop/Restart process
* Read logs (stdout, stderr)
* Monitor process uptime status
* Security by password authorization
* Clone/Remove process

## How to start

> There are 3 different ways to start. 
> The first is to start by extending a new Dockerfile from the project image and defining the jwt-keys (it may seem 
> complicated, but it is the most reliable and safe). 
> The second is to run via docker-compose with overriding env application parameters and volume for automatically 
> generated keys. 
> And the third option is to just run with env variable definition (the fastest but not the most reliable, 
> jwt key will be recreated uniquely every time).

First let's generate jwt passphrase, we need a random password with a length of 64 characters, just use this command:

`tr -dc A-Za-z0-9 </dev/urandom | head -c 64; echo`

### 1. Docker extend

It needs 2 files private.pem and public.pem, which can be obtained by running the container and copying the keys:

```
docker run --detach --name supervisord-monitor -e JWT_PASSPHRASE=generated-jwt-passphrase konekod/supervisord-monitor
docker exec --user app -it supervisord-monitor php bin/console lexik:jwt:generate-keypair
docker cp supervisord-monitor:/var/www/supervisord-monitor/config/jwt/private.pem private.pem
docker cp supervisord-monitor:/var/www/supervisord-monitor/config/jwt/public.pem public.pem
docker kill supervisord-monitor
docker rm supervisord-monitor
```

After that, let's create a Dockerfile in a separate directory:

```
FROM konekod/supervisord-monitor:latest

ENV JWT_PASSPHRASE=generated-jwt-passphrase

# Generated jwt keys
USER app
COPY private.pem config/jwt/private.pem
COPY public.pem config/jwt/public.pem
USER www-data

# Please set secure credentials instead of the default settings (guest is optional)
ENV APP_CREDENTIALS='[{"username":"admin","password":"admin","roles":["ROLE_MANAGER"]},{"username":"guest","password":"guest"}]'

# Host on which it is planned to run supervisord-monitor (needed to set cookie authorization)
ENV API_HOST=example.com

# Remote suprevisors
ENV SUPERVISORS_SERVERS=[{"ip":"app-container-frontent","port":9551,"name":"frontent","username":"default","password":"default"},{"ip":"app-container-backend","port":9551,"name":"backend","username":"default","password":"default"}]  
```

Final start

```
docker buildx build -t supervisord-monitor-override --load .

docker run --detach --name supervisord-monitor-override -p "10011:8080" supervisord-monitor-override
```

Now just open the site specified in `API_HOST` and everything should work.

### 2. Docker Compose

In a specific folder, create docker-compose.yml:
Be sure to create a jwt folder that will become volume manually, 
otherwise the created folder will have root privileges, 
which will break key creation (the jwt folder should always be there, it contains the keys)

```
version: "3.8"

name: supervisord-monitor-example

services:
  supervisord-monitor-app:
    container_name: supervisord-monitor-app
    image: konekod/supervisord-monitor
    environment:
      - API_HOST=example.com
      - APP_CREDENTIALS='[{"username":"admin","password":"admin","roles":["ROLE_MANAGER"]},{"username":"guest","password":"guest"}]'
      - JWT_PASSPHRASE=generated-jwt-passphrase
    volumes:
      - ./jwt:/var/www/supervisord-monitor/config/jwt:cached
    ports:
      - "10011:8080"
```

Here it is possible to change the volume mount settings to ro after creating the keys for security purposes.

### 3. Simple run

Jwt keys are automatically generated on the first startup themselves
(In `docker/supervisor/supervisord-dist.conf` there is `program:generate-jwt-if-not-exists`)

```
docker run \  
  --detach \  
  --name supervisord-monitor \  
  -e API_HOST=example.com \  
  -e APP_CREDENTIALS='[{"username":"admin","password":"admin","roles":["ROLE_MANAGER"]},{"username":"guest","password":"guest"}]' \  
  -e SUPERVISORS_SERVERS=[{"ip":"app-container-frontent","port":9551,"name":"frontent","username":"default","password":"default"},{"ip":"app-container-backend","port":9551,"name":"backend","username":"default","password":"default"}] \  
  konekod/supervisord-monitor
```

## Running via script

With this script it is possible to automatically recreate a container with everything needed

```shell
#!/bin/bash

container_id=$(docker ps | grep supervisord-monitor-app | awk '{ print $1 }')

docker kill "$container_id"
docker rm "$container_id"
docker pull konekod/supervisord-monitor
docker run -d \
  --name supervisord-monitor-app \
  -e SUPERVISORS_SERVERS="$(< /home/dev/supervisord_monitor/supervisord_monitor_servers.json)" \
  -e APP_CREDENTIALS='[{"username":"admin","password":"admin","roles":["ROLE_MANAGER"]},{"username":"guest","password":"guest"}]' \
  -e JWT_PASSPHRASE=generated-jwt-passphrase \
  -e API_HOST=supervisord-monitor.site.com \
  -p 10011:8080 \
  --restart=always \
  --network project_network \
  --volume /home/dev/supervisord_monitor/jwt:/var/www/supervisord-monitor/config/jwt:cached \
  konekod/supervisord-monitor:latest
```

## Configuration

### Environment variables

| Variable                         | Description                                                     | Default                                                                                                      |
|----------------------------------|-----------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| API_HOST                         | Site domain                                                     | localhost                                                                                                    |
| APP_CREDENTIALS[^5]              | Credentials                                                     | `[{"username":"admin","password":"admin","roles":["ROLE_MANAGER"]},{"username":"guest","password":"guest"}]` |
| JWT_PASSPHRASE                   | Passphrase for JWT encryption                                   | 73e14354e3850602ceb82c34c17c56e4aee66dbc9b0bda91652e2f57cb2200b3                                             |
| SUPERVISORS_SERVERS[^4]          | List of supervisord servers                                     | `[{"ip":"127.0.0.1","port":9551,"name":"default","username":"default","password":"default"}]`                |
| COLLECT_INTERVAL_IN_MICROSECONDS | Time between data collection in microseconds                    | 100000                                                                                                       |
| APP_ENV                          | Environment[^1]                                                 | prod                                                                                                         |
| BUILD_TYPE                       | Docker local build type[^3]                                     | dist                                                                                                         |
| APP_SECRET                       | Symfony secret (unused)                                         | a99a199bd3122ab1167d9b22dfe12624                                                                             |
| CORS_ALLOW_ORIGIN                | CORS origins (if different domains)                             | `^https?://(localhost\|127\.0\.0\.1)(:[0-9]+)?$`                                                             |
| JWT_SECRET_KEY                   | Path to private key                                             | /var/www/supervisord-monitor/config/jwt/private.pem                                                          |
| JWT_PUBLIC_KEY                   | Path to public key                                              | /var/www/supervisord-monitor/config/jwt/public.pem                                                           |
| LOCK_DSN                         | Lock component dsn (for rate limiter of authorization attempts) | flock                                                                                                        |
| DATABASE_URL                     | Database connection string                                      | `sqlite:///%kernel.project_dir%/var/data_%kernel.environment%.db`                                            |
| DEV_XDEBUG_AUTOSTART             | Build arg for xdebug mode[^2]                                   | `trigger`                                                                                                    |
| PHP_IDE_CONFIG                   | Environment variable for xdebug mode[^2]                        | `serverName=Docker`                                                                                          |
| PUID                             | User id                                                         | 1000                                                                                                         |
| PGID                             | Group id                                                        | 1000                                                                                                         |
| DEV_XDEBUG_IDE_KEY               | Build arg for xdebug mode[^2]                                   | 73e14354e3850602ceb82c34c17c56e4aee66dbc9b0bda91652e2f57cb2200b3                                             |
| DEV_HOST_IP                      | Docker network host ip (for local xdebug)                       | 172.18.3.1                                                                                                   |

[^1]: It means the mode of operation, by default prod (production), 
is possible to switch it to `dev` (after changing it, perform dev dependencies installation in the 
container under users - `docker exec -it --user app supervisord-monitor-app composer install`). 
Then a profiler for debugging and reporting errors will be available, and api documentation will be available at 
`example.com/api/docs`. 
This is also necessary for local development and testing. 
Do not use dev mode in production!

[^2]: Can be used in dev mode(BUILD_TYPE = dev) for errors debugging

[^3]: Only for development, clone this repository and run via `make init` for use it.

[^4]: See SupervisordServerEnvVarProcessor.php, if env var is not set, default value from `config/app/supervisord_servers.yaml` will be used

[^5]: See AppCredentialsEnvVarProcessor.php, if env var is not set, default value from `config/app/app_credentials.yaml` will be used

### Implementation

In certain scenarios, it may be necessary to manage processes on multiple servers from a centralized interface. This project is intended to address that requirement.

The system operates as follows: an administrator authenticates using credentials defined in APP_CREDENTIALS, via the LoginController, which is protected by a rate limiter (three attempts per minute). Upon successful authentication, the administrator is redirected to a page displaying available servers.

The backend communicates with each server through the SupervisorApiClient, which utilizes the XmlRpcEncoder for request serialization. Although supervisord claims to support standard XML-RPC, it implements a non-standard variant of the protocol, which necessitated the development of a custom encoder and decoder.

The administrator is presented with a list of processes running on each server and is able to perform the following operations:

* View stdout and stderr logs for each process.
    
* Clear logs for each process.

* Start, stop, or restart individual processes.

* If supervisor_twiddler is configured on the target supervisord instance (refer to 
tests/Functional/resources/supervisord.conf for an example), clone or delete processes.

Additionally, bulk operations are supported, such as:

    Clearing logs for all processes on a server.

    Starting, stopping, or restarting all processes simultaneously.

The interface is fully responsive and supports access from mobile devices.

Access control is implemented using two roles: ROLE_USER and ROLE_MANAGER. 
The ROLE_USER permission is assigned by default to all users defined in APP_CREDENTIALS, and provides read-only 
access to process statuses and logs. The ROLE_MANAGER permission enables full interaction with processes, 
including starting, stopping, restarting, cloning, and deletion. Users without this role are restricted to 
monitoring capabilities only.

The frontend provides the option to enable automatic state refresh, with a 
configurable interval (e.g., every 10 seconds). 
Additionally, synchronous data(sync refresh) fetching is available for cases where immediate results are required 
without waiting for the backend to complete information aggregation. 
This mode is suitable for environments with a limited number of servers, as it performs real-time data collection.

A dark theme is available and can be activated via the interface.

By default, the functionality for cloning and deleting processes is hidden from the user interface. 
It can be enabled by selecting the "Allow mutators" checkbox.

### Development

Create `docker-compose.override.yml` in the same folder as `docker-compose.yml`

```yaml
name: supervisord-monitor

services:
  supervisord-monitor-app:
    build:
      args:
        - DEV_XDEBUG_AUTOSTART=yes
    environment:
        - APP_ENV=dev
        - API_HOST=supervisord-monitor.local
        - JWT_PASSPHRASE=73e14354e3850602ceb82c34c17c56e4aee66dbc9b0bda91652e2f57cb2200b3
        - COLLECT_INTERVAL_IN_MICROSECONDS=600000000 # 10 minutes
    volumes:
      - ./tests/Functional/resources/supervisord_servers.yaml:/var/www/supervisord-monitor/config/app/supervisord_servers.yaml
```

There is a short command in the `Makefile` to start the whole project locally: 
`make init`, just call it and the project will be up.

If run it for the first time, run these commands after start up:

* Add local host to `/etc/hosts` - open as root and add `127.0.0.1 supervisord-monitor.local` as new line
* Create jwt keys with command - `make app_gen_jwt_keypair`
* Create and migrate database with command - drop into container by `make console` then `sh bin/database_provision.sh`

#### Additional development mode links

* https://supervisord-monitor.local/api/docs - Swagger auto-generated from sources API documentation (by api-platform)
* https://supervisord-monitor.local/_profiler - Symfony profiler

### Many servers

There is a second way to prescribe servers in supervisord-monitor, mount them as a file, example with docker compose:

```yaml
services:
  supervisord-monitor-app:
    volumes:
      - ./home/admin/supervisord_servers.yaml:/var/www/supervisord-monitor/config/app/supervisord_servers.yaml
      - ./home/admin/app_credentials.yaml:/var/www/supervisord-monitor/config/app/app_credentials.yaml # optional
```

### Sync / Background(async)

By default, supervisord monitor collects info in background and gives cache from backend, this switch to 
synchronous in Settings -> Sync refresh (Active).

Data collection is performed continuously, with the interval defined by the 
`COLLECT_INTERVAL_IN_MICROSECONDS` constant (measured in microseconds).
After enabling synchronous update mode, set COLLECT_INTERVAL_IN_MICROSECONDS to `600000000`. 
This configuration triggers background data collection every 10 minutes, thereby reducing the load on the backend. 
In this mode, data retrieved from the background will reflect a delay of up to 10 minutes.

### Auto-renew of JWT Authorization

A RenewJWTSubscriber is implemented to automatically refresh the authorization cookie once more than half of its 
validity period has elapsed. For example, if the JWT cookie has a lifetime of one week, it will be renewed after 
four days of activity. 

This mechanism ensures that the administrator remains authenticated without the need to repeatedly enter 
login credentials, provided the session is not inactive for more than one week.

### CLI-command for providing servers json

A dedicated command has been implemented to simplify the generation of a JSON configuration string 
for supervisord-monitor. To use it, execute the following instruction and follow the prompts:

```shell
docker exec -it supervisord-monitor-app bin/console app:build-server-json
```

### About background(async) data fetching

By default, state data is persisted in a SQLite database for simplicity. 
The database file used is either `var/data_dev.db` or `var/data_prod.db`, depending on the value of the 
APP_ENV environment variable.

### Directory structure

* assets - frontend sources
* bin - backend scripts
* config - backend configuration files
* docker - configuration files for docker
* migrations - backend migrations (for sqlite)
* public - backend entrypoint (for nginx routing)
* src - backend sources
* tests - backend tests
* var - backend runtime cache
* vendor - backend dependencies

### Backend scripts

There are 2 scripts to simplify the work with this tool:
`bin/database_provision.sh`, `bin/fix_if_invalid_jwt.sh` and `bin/generate_jwt_if_not_exists.sh`.

#### bin/database_provision.sh

Automatically runs in production environment and creates the database if it does not exist.
Also performs migrations regardless of the need to create a database.

#### bin/fix_if_invalid_jwt.sh

Automatically runs in production environment and if JWT keys are broken or missing it will force their 
creation with overwriting.

#### bin/generate_jwt_if_not_exists.sh

Automatically starts in the production environment and if there are no files physically present, 
it will forcibly create them with overwriting.

## Manual install

1.Clone supervisord-monitor to server vhost/webroot:

```
git clone git@github.com:KoNekoD/supervisord-monitor.git
```

2.Enable/Uncomment inet_http_server (found in supervisord.conf) for all supervisord servers.

```ini
[inet_http_server]
port=*:9001
username="username"
password="pass"
```

Do not forget to restart supervisord service after changing supervisord.conf

4.Edit supervisord-monitor configuration file and add all supervisord servers

```shell
vim config/app/supervisord_servers.yaml
```

5.Open web browser by configured domain url

## Troubleshooting

```
Did not receive a '200 OK' response from remote server.
```

Having this messages in most cases means that Supervisord Monitoring tools does not have direct network 
access to the Supervisord RPC2 http interface. Check firewall and network conectivity.

But it is possible to get error 500, in that case it is a supervisord-monitor problem, 
run this command to activate the profiler.
Where “supervisord-monitor-container-name” is the name of supervisord-monitor container, 
please replace it with configured container name.

```shell
container_id=$(docker ps | grep supervisord-monitor-container-name |  awk '{ print $1 }'); docker exec -it --user app $container_id sed -i 's/APP_ENV=prod/APP_ENV=dev/g' .env; docker exec -it --user app $container_id composer install
```

After that try to reproduce the error again and after that needed to share with us the error data from profiler,
trace, error name.
To open it add to URL /profiler, it will be something like “http://example.com:10011/_profiler” and 
find the necessary error 500 in the profiler.

---

```
Did not receive a '200 OK' response from remote server. (HTTP/1.0 401 Unauthorized)
```

Having `401 Unauthorized` that there is a connection between Supervisord Monitoring tool and 
Supervisord but the username or password are wrong.

---

```
NO_FILE
```

This error can be seen when reading logs with active flag "redirect_stderr=true", just remove this line,
and it should be possible to read stderr logs in supervisord-monitor.

---

```
UNKNOWN_METHOD
```

Having this message means that supervisord service doesn't have rpc interface enabled (only for v3+ of Supervisord).
To enable the rpc interface add this lines to the configuration file:

*From the Supervisord Docs*

In the sample config file, there is a section which is named [rpcinterface:supervisor]. By default, it looks like the
following:

```
[rpcinterface:supervisor]
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface
```

The [rpcinterface:supervisor] section must remain in the configuration for the standard setup of 
supervisor to work properly. If no additional functionality beyond the default behavior of 
supervisord is required, no further configuration is necessary for this section.

For more information go to the official Supervisord Configuration Docs:
http://supervisord.org/configuration.html#rpcinterface-x-section-settings

---

## Star History

![https://api.star-history.com/svg?repos=KoNekoD/supervisord-monitor&type=Date](https://api.star-history.com/svg?repos=KoNekoD/supervisord-monitor&type=Date)

## Who uses Supervisord Monitor?

* Currently used and maintained by the author.

Projects or companies using the Supervisord Monitor Tool are invited to be listed. To request inclusion, 
please email moskva111@yahoo.com with relevant details.
