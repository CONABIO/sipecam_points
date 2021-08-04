Instance in AWS: `m5.xlarge` and 250 gb of storage in Ubuntu 20.04.

Next bash script helps to tag the instance and install tools such as docker, docker-compose

```
#!/bin/bash
region=us-west-2
name_instance=zendro
user=ubuntu
##System update
export DEBIAN_FRONTEND=noninteractive
apt-get update -yq
##Install awscli
apt-get install -y python3-pip && pip3 install --upgrade pip
pip3 install awscli --upgrade
##Tag instance
INSTANCE_ID=$(curl -s http://instance-data/latest/meta-data/instance-id)
PUBLIC_IP=$(curl -s http://instance-data/latest/meta-data/public-ipv4)
aws ec2 create-tags --resources $INSTANCE_ID --tag Key=Name,Value=$name_instance-$PUBLIC_IP --region=$region
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
#install docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update -yq
apt-get install -y docker-ce
service docker start
groupadd docker
usermod -aG docker ubuntu && newgrp docker
#install docker-compose
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

#instal nvm that will install node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
echo 'export NVM_DIR="$HOME/.nvm"'                                       >> "$HOME/.bashrc"
echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> "$HOME/.bashrc"
echo '[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion" # This loads nvm bash_completion' >> "$HOME/.bashrc"
bash -c 'source $HOME/.nvm/nvm.sh && nvm install --lts'

#install yarn
bash -c 'source $HOME/.nvm/nvm.sh && npm install --global yarn'
```

Clone fork of Zendro and source profile:

```
git clone https://github.com/CONABIO/ZendroStarterPack.git
```

```
cd /home/ubuntu/ZendroStarterPack/

source ~/.profile
```

Modify some files:

`/home/ubuntu/ZendroStarterPack/graphql-server/.env`

```
ALLOW_ORIGIN="*"
JWT_SECRET="my secret"
```

Copy seeders:

```
cp -r ./seeders ./graphql-server
```

Build

```
yarn codegen:build
```

Change ocurrences of `<localhost>` to `IPV4` of ec2 instance:

`single-page-app/.env`

```
# Mandatory
NEXT_PUBLIC_ZENDRO_GRAPHQL_URL='http://<localhost>:3000/graphql'
NEXT_PUBLIC_ZENDRO_LOGIN_URL='http://<localhost>:3000/login'
NEXT_PUBLIC_ZENDRO_EXPORT_URL='http://<localhost>:3000/export'
NEXT_PUBLIC_ZENDRO_METAQUERY_URL='http://<localhost>:3000/meta_query'
NEXT_PUBLIC_ZENDRO_MAX_UPLOAD_SIZE=500
NEXT_PUBLIC_ZENDRO_MAX_RECORD_LIMIT=10000
# Optional
NEXT_PUBLIC_REDUX_LOGGER=false
# Server
ZENDRO_DATA_MODELS='./test/models/server1'
```

`single-page-app/.env.development`

```
# Mandatory
NEXT_PUBLIC_ZENDRO_GRAPHQL_URL='http://<localhost>:3000/graphql'
NEXT_PUBLIC_ZENDRO_LOGIN_URL='http://<localhost>:3000/login'
NEXT_PUBLIC_ZENDRO_EXPORT_URL='http://<localhost>:3000/export'
NEXT_PUBLIC_ZENDRO_METAQUERY_URL='http://<localhost>:3000/meta_query'
NEXT_PUBLIC_ZENDRO_MAX_UPLOAD_SIZE=500
NEXT_PUBLIC_ZENDRO_MAX_RECORD_LIMIT=10000
# Optional
NEXT_PUBLIC_REDUX_LOGGER=false
# Server
ZENDRO_DATA_MODELS='./test/models/server1'
```

`docker-compose-prod.yml`

```
...
      REACT_APP_SERVER_URL: "http://<localhost>:3000/graphql"
      REACT_APP_LOGIN_URL: "http://<localhost>:3000/login"
      REACT_APP_SERVER_METAQUERY_URL: "http://<localhost>:3000/meta_query"
```

If one wants that DB to be accesible add to `docker-compose-prod.yml`:

```
...
  zendro_postgres:
    container_name: zendroStarterPack_postgres
    build:
      context: ./contexts
      dockerfile: Dockerfile.postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - zendro_db_data:/var/lib/postgresql/data
    networks:
      - backend
    ports:
      - 5432:5432
```

Deploy:

```
yarn start
```

Go to:

```
<ipv4 of instance>:7000

<ipv4 of instance>:8080

```
using credentials configured.

If `REQUIRE_SIGN_IN` in Zendro config `docker-compose-prod.yml` is set to `false` then go to:

```
<ipv4 of instance>:3000/graphql
```

If graphql-server needs and update as new seeders were created in fork of Zendro's repo then

```
cd /home/ubuntu/ZendroStarterPack

yarn stop prod

git pull

cd /home/ubuntu/ZendroStarterPack

cp -r ./seeders ./graphql-server

#delete volume of postgreSQL:

docker volume ls | grep zendrostarterpack | awk '{print "docker volume rm " $2}' | sh

#start services

yarn start
```

Delete all:

```
#delete:

yarn stop prod

docker images | grep zendrostarterpack | awk '{print "docker rmi " $1}' | sh

docker volume ls | grep zendrostarterpack | awk '{print "docker volume rm " $2}' | sh

docker rmi sciencedb-code-generators:latest
```
