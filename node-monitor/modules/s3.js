var knox = require('knox'),
  fs = require('fs');
S3 = function (constants, bucketName) {
  this.client = knox.createClient({
    key: process.env[constants.strings.AWS_SECRET_ACCESS_KEY],
    secret: process.env[constants.strings.AWS_ACCESS_KEY_ID],
    bucket: bucketName
  });
};
S3.prototype.put = function (subfolder, file, name) {
  var self = this;
  fs.readFile(file, function (error, buffer) {
    if (error) console.log('Error putting file: ' + error);
    var request = self.client.put(subfolder + name, {
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
S3.prototype.get = function (subfolder, object) {
  this.client.get(subfolder + object).on('response', function (response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log(chunk);
    });
  }).end();
};
S3.prototype.remove = function (subfolder, file) {
  var request = this.client.del(subfolder + file).on('response', function (response) {
    console.log('Status: ' + response.statusCode);
    console.log('Endpoint: ' + request.url);
  }).end();
};
exports.S3 = S3;