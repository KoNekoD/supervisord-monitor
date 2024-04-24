# Supervisord Multi Server Monitoring Tool

![Screenshot](https://gitlab.com/sdt7772416/railgun/-/wikis/uploads/206d3272877e29018554dac9641b6a33/image.png)


## Features

* Monitor unlimited supervisord servers and processes
* Start/Stop/Restart process
* Read stderr log
* Monitor process uptime status

## Install

1.Clone supervisord-monitor to your vhost/webroot:
```
git clone git@gitlab.com:sdt7772416/railgun.git
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

---

```
Did not receive a '200 OK' response from remote server. (HTTP/1.0 401 Unauthorized)
```
Having `401 Unauthorized` means that you have connection between Supervisord Monitoring tool and Supervisord but the username or password are wrong.

---

```
UNKNOWN_METHOD
```
Having this message means that your supervisord service doesn't have rpc interface enabled (only for v3+ of Supervisord).
To enable the rpc interface add this lines to the configuration file:

*From the Supervisord Docs*

In the sample config file, there is a section which is named [rpcinterface:supervisor]. By default it looks like the following:

```
[rpcinterface:supervisor]
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface
```

The [rpcinterface:supervisor] section must remain in the configuration for the standard setup of supervisor to work properly.
If you don’t want supervisor to do anything it doesn’t already do out of the box, this is all you need to know about this type of section.

For more information go to the offitial Supervisord Configuration Docs:
http://supervisord.org/configuration.html#rpcinterface-x-section-settings

---

## Who uses Supervisord Monitor? ##

just me


If you've used Supervisord Monitor Tool send me email to moskva111@yahoo.com to add your project/company to this list.
