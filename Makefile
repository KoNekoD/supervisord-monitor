init: down build create_network up

build:
	docker compose build

up:
	docker compose up -d --remove-orphans
	docker compose exec supervisord-monitor-app bin/console assets:install

down:
	docker compose down

down_force:
	docker compose down -v --rmi=all --remove-orphans

console:
	if ! docker compose ps | grep -q supervisord-monitor; then make up; fi
	docker compose exec supervisord-monitor-app sh

stop:
	docker compose stop

create_network:
	docker network create --subnet 172.18.3.0/24 supervisord_monitor_network >/dev/null 2>&1 || true

app_gen_jwt_keypair:
	docker compose exec supervisord-monitor-app php bin/console lexik:jwt:generate-keypair

app_phpunit:
	docker compose exec supervisord-monitor-app composer run phpunit

code_phpstan:
	docker compose exec supervisord-monitor-app composer run phpstan

code_cs_fix:
	docker compose exec supervisord-monitor-app composer run cs-fixer

code_rector:
	docker compose exec supervisord-monitor-app composer run rector

code_cs_fix_diff:
	docker compose exec supervisord-monitor-app composer run cs-fixer-diff

code_cs_fix_diff_status:
	if make code_cs_fix_diff; then \
	    printf '\n\n\n [OK] \n\n\n'; exit 0; \
	else \
	    printf '\n\n\n [FAIL] \n\n\n'; exit 1; \
	fi

front_format_fix: ## Format frontend
	docker exec supervisord-monitor-app /bin/sh -c 'cd assets && npm run format:fix'
