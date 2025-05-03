#!/bin/sh

# Create database if it does not exist
if [ ! -f var/data_dev.db ]; then
  php bin/console doctrine:database:create -n
fi

php bin/console doctrine:migrations:migrate -n
