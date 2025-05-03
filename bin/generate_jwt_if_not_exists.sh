#!/bin/sh

# If can't generate token or keys don't exist, generate keys
if ! bin/console lexik:jwt:generate-token test >/dev/null 2>&1 || [ ! -f config/jwt/private.pem ] || [ ! -f config/jwt/public.pem ]; then
  php bin/console lexik:jwt:generate-keypair -n --overwrite
fi
