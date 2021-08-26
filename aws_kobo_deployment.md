1. Select ubuntu 20.04, m5.large, 100 gb for storage, next script installs docker and docker-compose

```
#!/bin/bash
region=us-west-2
name_instance=kobo-sandbox
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
```

2. Create route 53 DNS
3. Create records in route 53:

```
<subdomain>.<my route53 dns>.net

kf.<subdomain>.<my route53 dns>.net

ee.<subdomain>.<my route53 dns>.net

kc.<subdomain>.<my route53 dns>.net
```

and edit them with type A and ipv4 of instance, example: 34.219.235.74

4. Clone repo https://github.com/kobotoolbox/kobo-install

```bash
git clone https://github.com/kobotoolbox/kobo-install.git

exit

#ssh again, this exit to use docker without sudo

cd kobo-install/
```
5. While next python3 command is running after finished questions of config, increase `server_names_hash_bucket_size` to 256 `/home/ubuntu/kobo-docker/nginx/kobo-docker-scripts/nginx.conf`

```
python3 run.py

╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║ Welcome to kobo-install.                                           ║
║                                                                    ║
║ You are going to be asked some questions that will determine how   ║
║ to build the configuration of `KoBoToolBox`.                       ║
║                                                                    ║
║ Some questions already have default values (within brackets).      ║
║ Just press `enter` to accept the default value or enter `-` to     ║
║ remove previously entered value.                                   ║
║ Otherwise choose between choices or type your answer.              ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
Where do you want to install?
[/home/ubuntu/kobo-docker]:
Please confirm path [/home/ubuntu/kobo-docker]
	1) Yes
	2) No
[1]:
Do you want to see advanced options?
	1) Yes
	2) No
[2]:
What kind of installation do you need?
	1) On your workstation
	2) On a server
[2]:
Public domain name? [kobo.local]: <my route53 dns>
KPI sub domain? [kf]:
KoBoCat sub domain? [kc]:
Enketo Express sub domain name? [ee]:
Do you want to use HTTPS?
	1) Yes
	2) No
[1]:
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║ Please note that certificates must be installed on a reverse-proxy ║
║ or a load balancer.kobo-install can install one, if needed.        ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
Auto-install HTTPS certificates with Let's Encrypt?
	1) Yes
	2) No - Use my own reverse-proxy/load-balancer
[1]:
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║ WARNING!                                                           ║
║                                                                    ║
║ Domain names must be publicly accessible.                          ║
║ Otherwise Let's Encrypt will not be able to valid your             ║
║ certificates.                                                      ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
Email address for Let's Encrypt? [support@<domain>]:
Please confirm [support@<domain>]
	1) Yes
	2) No
[1]:
Cloning `nginx-certbot` repository to `/home/ubuntu/nginx-certbot`
Cloning into '/home/ubuntu/nginx-certbot'...
remote: Enumerating objects: 167, done.
remote: Total 167 (delta 0), reused 0 (delta 0), pack-reused 167
Receiving objects: 100% (167/167), 31.61 KiB | 3.95 MiB/s, done.
Resolving deltas: 100% (85/85), done.
SMTP server? []:
SMTP port? [25]:
SMTP user? []:
From email address? [support@<my route53 dns>]:
Super user's username? [<default>]: <mysuperuser>
Super user's password? [<random password>]: <mypassword>
Do you want to activate backups?
	1) Yes
	2) No
[2]:
```

Another output if we want to expose ports of docker containers

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║ Welcome to kobo-install.                                           ║
║                                                                    ║
║ You are going to be asked some questions that will determine how   ║
║ to build the configuration of `KoBoToolBox`.                       ║
║                                                                    ║
║ Some questions already have default values (within brackets).      ║
║ Just press `enter` to accept the default value or enter `-` to     ║
║ remove previously entered value.                                   ║
║ Otherwise choose between choices or type your answer.              ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
Where do you want to install?
[/home/ubuntu/kobo-docker]:
Please confirm path [/home/ubuntu/kobo-docker]
	1) Yes
	2) No
[1]:
Do you want to see advanced options?
	1) Yes
	2) No
[2]: 1
What kind of installation do you need?
	1) On your workstation
	2) On a server
[2]: 2
Please choose which network interface you want to use?
	ens5) <ip>
	other) Other
[ens5]:
Do you want to use separate servers for front end and back end?
	1) Yes
	2) No
[2]:
Public domain name? [kobo.local]: <my route53 dns>
KPI sub domain? [kf]:
KoBoCat sub domain? [kc]:
Enketo Express sub domain name? [ee]:
Do you want to use HTTPS?
	1) Yes
	2) No
[1]:
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║ Please note that certificates must be installed on a reverse-proxy ║
║ or a load balancer.kobo-install can install one, if needed.        ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
Auto-install HTTPS certificates with Let's Encrypt?
	1) Yes
	2) No - Use my own reverse-proxy/load-balancer
[1]:
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║ WARNING!                                                           ║
║                                                                    ║
║ Domain names must be publicly accessible.                          ║
║ Otherwise Let's Encrypt will not be able to valid your             ║
║ certificates.                                                      ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
Email address for Let's Encrypt? [support@kobo.local]:
Please confirm [support@kobo.local]
	1) Yes
	2) No
[1]:
Cloning `nginx-certbot` repository to `/home/ubuntu/nginx-certbot`
Cloning into '/home/ubuntu/nginx-certbot'...
...
Internal port used by reverse proxy?
[8080]:
SMTP server? []:
SMTP port? [25]:
SMTP user? []:
From email address? [support@<my route53 dns>]:
Super user's username? [<default>]: <mysuperuser>
Super user's password? [<random password>]: <mypasswordr>
Docker Compose prefix? (leave empty for default) []:
Use staging mode?
	1) Yes
	2) No
[2]:
KoBoCat PostgreSQL database name?
[<default>]:
KPI PostgreSQL database name?
[<default>]:
PostgreSQL user's username?
[<default>]:
PostgreSQL user's password?
[<random password>]: <mypostgresqlpassword>
Do you want to tweak PostgreSQL settings?
	1) Yes
	2) No
[2]:
MongoDB root's username?
[<default>]:
MongoDB root's password?
[<random password>]: <mymongodbpassword>
MongoDB user's username?
[<default>]:
MongoDB user's password?
[<random password>]: <mymongodbpassword>
Redis password?
[<random password>]: <myredispassword>
Do you want to expose back-end container ports (`PostgreSQL`, `MongoDB`, `redis`)?
	1) Yes
	2) No
[2]: 1
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║ WARNING!                                                           ║
║                                                                    ║
║ When exposing back-end container ports, it is STRONGLY recommended ║
║ to use a firewall to grant access to front-end containers only.    ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
Do you want to customize service ports?
	1) Yes
	2) No
[2]:
Do you want to customize the application secret keys?
	1) Yes
	2) No
[2]:
Do you want to use AWS S3 storage?
	1) Yes
	2) No
[2]:
Google Analytics Identifier []:
Google API Key []:
Do you want to use Sentry?
	1) Yes
	2) No
[2]:
Do you want to tweak uWSGI settings?
	1) Yes
	2) No
[2]:
Do you want to activate backups?
	1) Yes
	2) No
[2]:
Cloning into '/home/ubuntu/kobo-docker'...
...

Note: switching to '2.021.30'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.

If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -c with the switch command. Example:

  git switch -c <new-branch-name>

Or undo this operation with:

  git switch -

Turn off this advice by setting config variable advice.detachedHead to false

HEAD is now at db35e68 Upgrade KPI and KoBoCAT to 2.021.30
From https://github.com/kobotoolbox/kobo-docker
 * tag               2.021.30   -> FETCH_HEAD
Creating network "nginx-certbot_default" with the default driver
...
Pulling nginx (nginx:1.15-alpine)...
...
Pulling redis_cache (redis:3.2)...
Pulling mongo (mongo:3.4)...
Pulling postgres (postgis/postgis:9.5-2.5)...
...
Pulling kpi (kobotoolbox/kpi:2.021.30)...
...
The PostgreSQL database is running!
...
Pulling nginx (nginx:1.19)...
Pulling enketo_express (kobotoolbox/enketo-express-extra-widgets:2.5.6)...
Pulling kobocat (kobotoolbox/kobocat:2.021.30)...
...
Waiting for environment to be ready. It can take a few minutes.
........

```

For logs use:

```bash
python3 run.py -l
```

If stop is needed:

```bash
python3 run.py -S
```

Go to:

```bash
https://kf.<subdomain>.<my route53 dns>.net
https://ee.<subdomain>.<my route53 dns>.net
https://kc.<subdomain>.<my route53 dns>.net
```
