require('long-stack-traces');

var credentials = require('./credentials'),
  constants = require('./constants'),
    helper = require('./helper');
helper = new helper.Helper();
Bootstrap = function () {

};
Bootstrap.prototype.addGistsToGithub = function () {
  var github = require('./github');
  github = new github.Github(credentials);
  if (!path)
    path = 'gists/'; // ../gists/
  helper.getGistsToAdd(path, function(files) {
    github.addGists('bootstrap', 'false', files, function(response) {
      // this.launchAdminApiInstance();
    });
  });
};
Bootstrap.prototype.createKeyPairs = function () {
  var aws = require('./aws')
  aws = new aws.Aws(credentials, constants, helper);
  var keyPairs = ['admin', 'api', 'webserver', 'realtime', 'db'];
  keyPairs.forEach(function(keyPair) {
    console.log('Adding key pair: ' + keyPair);
    aws.createKeyPair(keyPair);
  });
};
Bootstrap.prototype.createSecurityGroups = function () {
  var aws = require('./aws')
  aws = new aws.Aws(credentials, constants, helper);
  var myIp = '0.0.0.0/32', allowedPorts = {}, allowedGroups = ['admin', 'api', 'webserver', 'realtime', 'db'];
  allowedPorts['1'] = '65335';
  var securityGroups = [
    {
      name: 'admin',
      ports: allowedPorts,
      ips: [
        myIp
      ], 
      groups: allowedGroups    
    },
    {
      name: 'api',
      ports: allowedPorts,
      ips: [
        myIp
      ], 
      groups: allowedGroups
    },
    {
      name: 'webserver',
      ports: allowedPorts,
      ips: [
        myIp
      ], 
      groups: allowedGroups
    },
    {
      name: 'realtime',
      ports: allowedPorts,
      ips: [
        myIp
      ], 
      groups: allowedGroups
    },
    {
      name: 'db',
      ports: allowedPorts,
      ips: [
        myIp
      ], 
      groups: allowedGroups
    }
  ];  
  for (var i in securityGroups) {  
    console.log('Adding security group: ' + securityGroups[i].name);
    for (var j in securityGroups[i].ports) {
      console.log('With port range: ' + j + '-' + securityGroups[i].ports[j]);
    }
    securityGroups[i].ips.forEach(function(ip) {
      console.log('With allowed IP: ' + ip);
    });
    securityGroups[i].groups.forEach(function(group) {
      console.log('With allowed group: ' + group);
    });
    aws.createSecurityGroup(securityGroups[i].name, securityGroups[i].ports, securityGroups[i].ips. securityGroups[i].groups);
  };
};
Bootstrap.prototype.launchAdminApiInstance = function () {

};
Bootstrap.prototype.createAMIInstances = function () {

};
Bootstrap.prototype.launchRedisInstances = function () {

};
Bootstrap.prototype.launchRealtimeInstances = function () {

};
Bootstrap.prototype.launchApiInstances = function () {

};
Bootstrap.prototype.launchWebserverInstances = function () {

};
Bootstrap.prototype.killDashNine = function () {

};
exports.Bootstrap = Bootstrap;