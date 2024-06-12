#!/bin/sh

# if no file config/jwt/private.pem or config/jwt/public.pem exists
if [ ! -f config/jwt/private.pem ] || [ ! -f config/jwt/public.pem ]; then
  php bin/console lexik:jwt:generate-keypair --overwrite
fi
