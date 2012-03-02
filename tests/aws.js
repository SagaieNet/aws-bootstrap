require('./setup');

var aws = require('../aws');
aws = new aws.Aws();
aws.createKeyPair('test');