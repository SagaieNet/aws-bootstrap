#!/bin/bash

cd /home/ubuntu

# Git + setup
type=api
yes | apt-get install git
git clone https://$username:$password@github.com/gist/$gist.git
chmod a+x $gist/*
source $gist/credentials.sh # is extended by
  source $gist/common_utils.sh # is extended by
    source $gist/base_setup.sh # is extended by this

setup_instance >> setup_instance.log 2>&1

# Install instance-specific packages and applications
git_bootstrap_repo
  add_upstart_job $type "node /home/ubuntu/yc-bootstrap/$type/application.js"
  monitor_new_service $type

# Bundle AMI
ami_name="$github_account_name-$type-ami"
build_ami $ami_name >> build_ami.log 2>&1