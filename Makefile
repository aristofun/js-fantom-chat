# .PHONY: app test log doc
.PHONY: test

export DOCKER_HOST := ssh://root@178.62.184.188

build:
	docker-compose build --build-arg "NODE_ENV=production"

push:
	docker-compose push

deploy: build push
	docker stack deploy --with-registry-auth --compose-file docker-stack.yml socketchat-app

status:
	docker stack ls
	docker node ls
	docker stack services socketchat-app
	docker stack ps socketchat-app
    # https://stackoverflow.com/a/45373282/1245302
    # docker service ps --no-trunc socketchat-app
    # journalctl -u docker.service | tail -n 50

run:
	npm run dev
