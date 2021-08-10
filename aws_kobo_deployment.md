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
