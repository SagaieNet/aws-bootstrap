var knox = require('knox'),
  fs = require('fs');
S3 = function (credentials, constants, helper) {
  this.credentials = credentials;
  this.constants = constants;
  this.helper = helper;
  this.client = knox.createClient({
    key: credentials.aws_key,
    secret: credentials.aws_secret,
    bucket: credentials.s3_bucket
  });
};
S3.prototype.put = function (file, name) {
  var self = this;
  fs.readFile(file, function (error, buffer) {
    if (error) console.log('Error putting file: ' + error);
    var request = self.client.put(this.constants.subfolder + name, {
      'Content-Length': buffer.length,
      'Content-Type': 'text/plain'
    });
    request.on('response', function (response) {
      console.log('Status: ' + response.statusCode);
      console.log('Endpoint: ' + request.url);
    });
    request.end(buffer);
  });
};
S3.prototype.get = function (object) {
  this.client.get(this.constants.subfolder + object).on('response', function (response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log(chunk);
    });
  }).end();
};
S3.prototype.remove = function (file) {
  var request = this.client.del(this.constants.subfolder + file).on('response', function (response) {
    console.log('Status: ' + response.statusCode);
    console.log('Endpoint: ' + request.url);
  }).end();
};
exports.S3 = S3;