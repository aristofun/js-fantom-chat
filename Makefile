# .PHONY: app test log doc
.PHONY: test

export DOCKER_HOST := ssh://root@178.62.229.43
export STACK_NAME=socketchat-app

build:
	docker-compose build --build-arg "NODE_ENV=production"

push:
	docker-compose push

deploy: build push
	docker stack deploy --with-registry-auth --prune --compose-file docker-stack.yml $(STACK_NAME)

status:
	docker stack ls
	docker node ls
	docker stack services socketchat-app
	docker stack ps socketchat-app
    # https://stackoverflow.com/a/45373282/1245302
    # docker service ps --no-trunc socketchat-app
    # journalctl -u docker.service | tail -n 50

logs:
	docker service ps --no-trunc socketchat-app_nginx
	docker service ps --no-trunc socketchat-app_letsencrypt
	docker service ps --no-trunc socketchat-app_node

run:
	npm run dev

provision-ssl:
	ansible-playbook .ansible/books/docker_letsencrypt.yml -e STACK_NAME=$(STACK_NAME)

provision:
	ansible-playbook .ansible/books/go.yml
	make provision-ssl

test-nginx-container:
	docker run -p 80:80 -p 443:443 -p 8088:8088 -v /etc/letsencrypt:/etc/letsencrypt registry.gitlab.com/aristofun/docker-tests/socketchat-nginx:latest

check-nginx-pid:
	 docker exec $$(docker ps --filter label=letsencrypt.role=listener -q) sh -c ps
