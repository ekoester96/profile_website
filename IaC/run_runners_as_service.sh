#!/bin/bash
cd ~/runners/portfolio-runner
sudo ./svc.sh install ethan
sudo ./svc.sh start

cd ~/runners/project-runner
sudo ./svc.sh install ethan
sudo ./svc.sh start