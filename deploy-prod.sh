docker-compose build --build-arg "NODE_ENV=production" && docker-compose push && \
DOCKER_HOST="ssh://root@178.62.184.188" docker stack deploy --with-registry-auth --compose-file docker-stack.yml socketchat-app
