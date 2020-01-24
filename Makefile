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
	docker service ps --no-trunc socketchat-app_node

# Local node server run
run:
	npm run dev

# Provision remote host - prepare swarm cluster with ansible playbooks
provision:
	ansible-playbook .ansible/books/go.yml
