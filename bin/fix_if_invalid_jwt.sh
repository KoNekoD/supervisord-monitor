#!/bin/sh

token=$(bin/console lexik:jwt:generate-token test)

if [ -z "$token" ]; then
  php bin/console lexik:jwt:generate-keypair --overwrite
fi
