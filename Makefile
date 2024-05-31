COMPOSE_FILE = ./config/docker/docker-compose.yml
ENV_FILE = ./config/docker/.env
DC = docker compose -f ${COMPOSE_FILE} --env-file ${ENV_FILE}
DC_EXEC = ${DC} exec supervisord-monitor

build:
	${DC} build

up:
	${DC} up -d --remove-orphans
	${DC_EXEC} bin/console assets:install

down:
	${DC} down -v --rmi=all --remove-orphans

console:
	if ! ${DC} ps | grep -q supervisord-monitor; then make up; fi
	${DC_EXEC} sh

include ./config/docker/.env
dc_create_network:
	docker network create --subnet 172.18.3.0/24 ${EXTERNAL_NETWORK_NAME} >/dev/null 2>&1 || true

app_test_fixtures:
	${DC_EXEC} php bin/console --env=test doctrine:fixtures:load -n

app_phpunit:
	${DC_EXEC} composer run phpunit

db_migrate:
	${DC_EXEC} bin/console doctrine:migrations:migrate --no-interaction

db_diff:
	${DC_EXEC} bin/console doctrine:migrations:diff --no-interaction

code_phpstan:
	${DC_EXEC} composer run phpstan

code_deptrac:
	${DC_EXEC} composer run deptrac

code_cs_fix:
	${DC_EXEC} composer run cs-fixer

code_rector:
	${DC_EXEC} composer run rector

code_cs_fix_diff:
	${DC_EXEC} composer run cs-fixer-diff

code_cs_fix_diff_status:
	if make code_cs_fix_diff; then \
	    printf '\n\n\n [OK] \n\n\n'; \
	    exit 0; \
	else \
	    printf '\n\n\n [FAIL] \n\n\n'; \
	    exit 1; \
	fi

code_cs_fix_diff_status_no_docker:
	if make code_cs_fix_diff_no_docker; then \
	    printf '\n\n\n [OK] \n\n\n'; \
	    exit 0; \
	else \
	    printf '\n\n\n [FAIL] \n\n\n'; \
	    exit 1; \
	fi

gen_ts:
	${DC_EXEC} composer run gen-ts
