##################
# Variables
##################

COMPOSE_FILE = ./config/docker/docker-compose.yml
ENV_FILE = ./config/docker/.env
DOCKER_COMPOSE = docker compose -f ${COMPOSE_FILE} --env-file ${ENV_FILE}
DOCKER_COMPOSE_PHP_FPM_EXEC = ${DOCKER_COMPOSE} exec railgun

##################
# Docker compose
##################

# Build docker container
dc_build:
	${DOCKER_COMPOSE} build

dc_up:
	${DOCKER_COMPOSE} up -d --remove-orphans

dc_down:
	${DOCKER_COMPOSE} down -v --rmi=all --remove-orphans

dc_start:
	${DOCKER_COMPOSE} start

dc_stop:
	${DOCKER_COMPOSE} stop

dc_restart:
	make dc_stop dc_start

dc_ps: # Show list containers
	${DOCKER_COMPOSE} ps

dc_logs: # View output from containers
	${DOCKER_COMPOSE} logs -f

build:
	make dc_build

start:
	make dc_start

stop:
	make dc_stop

restart:
	make dc_restart

up:
	make dc_up

down:
	make dc_down

console:
	if ! ${DOCKER_COMPOSE} ps | grep -q railgun; then make up; fi
	make app_bash

##################
# Docker
##################

include ./config/docker/.env
dc_create_network:
	docker network create --subnet 172.18.3.0/24 ${EXTERNAL_NETWORK_NAME} >/dev/null 2>&1 || true

docker_clean:
	docker system prune

##################
# App
##################

# Drop into docker container
app_bash:
	${DOCKER_COMPOSE_PHP_FPM_EXEC} bash

app_test_fixtures:
	${DOCKER_COMPOSE_PHP_FPM_EXEC} php bin/console \
		--env=test doctrine:fixtures:load -n

app_phpunit:
	${DOCKER_COMPOSE_PHP_FPM_EXEC} composer run phpunit

##################
# Composer
##################

php_comp_dev:
	${DOCKER_COMPOSE_PHP_FPM_EXEC} composer install

##################
# Database
##################

db_migrate:
	${DOCKER_COMPOSE_PHP_FPM_EXEC} bin/console doctrine:migrations:migrate \
		--no-interaction

db_diff: # Alternative without Maker(bin/console make:migration)
	${DOCKER_COMPOSE_PHP_FPM_EXEC} bin/console doctrine:migrations:diff \
		--no-interaction

##################
# Static code analysis
##################

code_phpstan:
	${DOCKER_COMPOSE_PHP_FPM_EXEC} composer run phpstan

code_deptrac:
	${DOCKER_COMPOSE_PHP_FPM_EXEC} composer run deptrac

code_cs_fix:
	${DOCKER_COMPOSE_PHP_FPM_EXEC} composer run cs-fixer

code_rector:
	${DOCKER_COMPOSE_PHP_FPM_EXEC} composer run rector

code_cs_fix_diff:
	${DOCKER_COMPOSE_PHP_FPM_EXEC} composer run cs-fixer-diff

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
	${DOCKER_COMPOSE_PHP_FPM_EXEC} composer run gen-ts
