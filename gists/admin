cd /home/ubuntu

# TESTING
username="username"
password="password"

# Git + setup
type=admin
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
  
# Bootstrap
run_bootstrap >> yc_bootstrap.log 2>&1