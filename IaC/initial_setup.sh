#!/bin/bash
# Install Docker
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add myself to docker group so I don't need sudo
sudo usermod -aG docker $(whoami)

# create directory structure 
mkdir -p ~/infrastructure/{nginx/certs,cloudflared,scripts}
mkdir -p ~/sites

# clone repositories
cd ~/sites
git clone git@github.com:ekoester96/profile_website.git
git clone git@github.com:ekoester96/cyber_law_project.git

# Install Node.js 
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

cd ~/sites/cyber_law_project
npm install
npm run build

# Portfolio cert
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ~/infrastructure/nginx/certs/portfolio.key \
  -out ~/infrastructure/nginx/certs/portfolio.crt \
  -subj "/CN=ekoester.org"

# Project cert
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ~/infrastructure/nginx/certs/project.key \
  -out ~/infrastructure/nginx/certs/project.crt \
  -subj "/CN=project.ekoester.org"
# Log out and back in for group change to take effect
exit