Aws = function (credentials, constants, helper) {
  var aws = require('node-aws'), ec2 = require('ec2');
  this.credentials = credentials;
  this.constants = constants;
  this.helper = helper;
  /* this.aws = aws.createClient(credentials.aws_key, credentials.aws_secret); */
  this.ec2 = ec2.createClient({ 
    key: credentials.aws_key, 
    secret: credentials.aws_secret
  });
};
Aws.prototype.createKeyPair = function(keyName) {
  var request = {}, s3 = require('./s3');
  s3 = new s3.S3(this.credentials, this.constants);
  request['KeyName'] = keyName;
  this.ec2.call('CreateKeyPair', request, function (response) {
    var keyPairMaterial = response.keyMaterial;
    console.log('keyPairMaterial: ' + keyPairMaterial);
    s3.putString(keyPairMaterial, keyName + '.pem');
  });
  this.ec2.execute();
};
Aws.prototype.createSecurityGroups = function(securityGroups) {
  var self = this, request = {}, permissions = 1;
  for (var i in securityGroups) {  
    console.log('Adding security group: ' + securityGroups[i].name);
    console.log('Permission count: ' + permissions);
    request['GroupName'] = securityGroups[i].name;
    for (var j in securityGroups[i].ports) {
      console.log('With port range: ' + j + '-' + securityGroups[i].ports[j]);
    }
    securityGroups[i].ips.forEach(function(ip) {
      console.log('Adding authorized IP: ' + ip + ', with ports:');
      request['IpPermissions.' + String.valueOf(permissions) + '.IpProtocol'] = 'tcp';
      for (var k in securityGroups[i].ports) {
        console.log(k + '-' + securityGroups[i].ports[k]);
        request['IpPermissions.' + String.valueOf(permissions) + '.FromPort'] = k;
        request['IpPermissions.' + String.valueOf(permissions) + '.ToPort'] = securityGroups[i].ports[k];
      }
      request['IpPermissions.' + String.valueOf(permissions) + '.IpRanges.m.CidrIp'] = ip;
    });
    securityGroups[i].groups.forEach(function(group) {
      console.log('With allowed group: ' + group);
      request['IpPermissions.' + String.valueOf(permissions) + '.IpProtocol'] = 'tcp';
      for (var k in securityGroups[i].ports) {
        console.log(k + '-' + securityGroups[i].ports[k]);
        request['IpPermissions.' + String.valueOf(permissions) + '.FromPort'] = k;
        request['IpPermissions.' + String.valueOf(permissions) + '.ToPort'] = securityGroups[i].ports[k];
      }
      request['IpPermissions.' + String.valueOf(permissions) + '.Groups.m.GroupName'] = group; 
    });
    permissions++;
  };
  for (var i in request) {
    console.log('Request: ' + i + ', value: ' + request[i]);
  }
  this.ec2.call('AuthorizeSecurityGroupIngress', request, function (response) {
    var securityGroupId = response.instancesSet[0].securityGroupId;
    console.log('securityGroupId: ' + securityGroupId);
  });
  this.ec2.execute();
};
Aws.prototype.provisionElasticIpAddresses = function() {
  /* Admin API */
  
  /* Realtime */
  
  /* Redis? */
};
Aws.prototype.associateElasticIpAddress = function(type, instanceId, callback) {

};
Aws.prototype.deassociateElasticIpAddress = function(type, callback) {

};
Aws.prototype.getInstanceIdFromTag = function(tagKey, tagValue, callback) {
  
};
Aws.prototype.launchAdminApiInstance = function (ami, keypair, userData) {
  var self = this;
  var request = {};
  request['ImageId'] = ami;
  request['KeyName'] = keypair;
  request['SecurityGroup.1'] = 'admin';
  request['UserData'] = this.helper.base64encode(userData);
  request['InstanceType'] = 'm1.small';
  request['Placement.AvailabilityZone'] = this.helper.getRandomAvailabilityZone();  
  request['Monitoring.Enabled'] = 'true';
  request['DisableApiTermination'] = 'true';
  this.ec2.call('RunInstances', request, function (response) {
    //instanceId = response.instancesSet[0].instanceId;
    //self.ec2.associateElasticIpAddress('admin', instanceId) {
    //});
  });
  this.ec2.execute();
};
Aws.prototype.initApiAmi = function () {
};
Aws.prototype.initRedisMqAmi = function () {
};
Aws.prototype.initRealtimeAmi = function () {
};
Aws.prototype.createWebserverLaunchConfiguration = function () {
};
Aws.prototype.createApiLaunchConfiguration = function () {
};
Aws.prototype.createWebserverAutoScalingGroup = function () {
};
Aws.prototype.createApiAutoScalingGroup = function () {
};
Aws.prototype.createTopics = function () {
};
Aws.prototype.listTopics = function () {
};
Aws.prototype.listSubscriptions = function () {
};
Aws.prototype.subscribe = function () {
};
Aws.prototype.confirmSubscriptions = function () {
};
exports.Aws = Aws;