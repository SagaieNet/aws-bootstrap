# yc-bootstrap

A scaling, monitored, distributed-ready, realtime, persistent infrastructure-creator.  Take control over your IAAS.

**PRE ALPHA-WARE**, not ready, being ported! 


## Why

1. Any code that was written for yc-boostrap, or external service used (cassandra.io), was done on a monetary basis.  You can always scale up if you don't fail.

1. PAAS are great, but expensive (just look at the added cost of Heroku add-ons, or Chef hosting).  If you have a basic knowledge of AWS services, you can handle issues that arise.

1. It should be about the idea and service, not about the infrastructure. 

1. Puppet/Chef/CloudFormation are kind of a pain in the ass; let's stick to Bash basics.

## Giants

First and fore-most, I've perfected this from m2m.io environment setup.

## Pre-reqs

AWS account 
Github account

### Dependencies

While you don't have to worry about these, it's good to know what went into the project.

* node-monitor, available here: 
* node-cloudwatch, available via npm
* ec2, available via npm

## ....Go

* Export your credentials from the command line:

From any unix machine: 

`curl https://frank.lovecch.io/labs/aws-bootstrap | aws-bootstrap`

### What it does

Creates Gists for versioned instance setups based on input credentials.
Spings up this with AWS user-data which pulls Gists.

Loadbalancer -> 2 Webservers/API -> MQdb (3 'Redis) cassandra.io
                  |
                        ^
     Socket.io <- Either of boxes -> Socket.io

Create alarms in CloudWatch to auto-scale webserver based on traffic.  Uses hummingbird. Comet as backup.

Backs-up to S3

## Gisting

```
cd /home/ubuntu

# Git + setup
gist_id=<id>
yes | apt-get install git
git clone https://<username>:<password>@github.com/gist/$gist_id.git
chmod a+x $gist_id/*
source $gist_id/credentials.sh # is extended by
  source $gist_id/common_utils.sh # is extended by
    source $gist_id/base_setup.sh # is extended by this

# Install API on every box
install_play_framework
  git_repo <my-play-app>
  install_play_framework_app /home/ubuntu/<my-play-app>
    monitor_new_service <my-play-app>

# Account for changes
rm -r $gist_id && shutdown -r now
```

### Technical

1. Submit Github + Twilio + AWS credentials (phone #'s?), generate unique credentials on (my) server-side and pass to Gists.
1. Launch a monitoring/admin/ci instance w/ an Elastic IP.  Configure the instance. 
1. Add the Gists to the Github account.
1. Create Security Groups for each type of instance.
1. Create SSH keys for each type of instance, upload to S3.
1. Create SNS topics for each type of alarm (3 types) (auto-subscribe to subscriptions from admin).
1. Launch AMI instances for each type based on Gists.
1. Poll until all the AMIs are listed in EC2/uploaded to S3.
1. On complete, create AutoScaling groups, starting with API.
1. Launch AutoScaling groups with CloudWatch alarm subscriptions pointed at Elastic IP.