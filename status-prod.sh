DOCKER_HOST="ssh://root@178.62.184.188" docker stack ls
DOCKER_HOST="ssh://root@178.62.184.188" docker node ls
DOCKER_HOST="ssh://root@178.62.184.188" docker stack services socketchat-app
DOCKER_HOST="ssh://root@178.62.184.188" docker stack ps socketchat-app

# https://stackoverflow.com/a/45373282/1245302
# docker service ps --no-trunc socketchat-app
# journalctl -u docker.service | tail -n 50 