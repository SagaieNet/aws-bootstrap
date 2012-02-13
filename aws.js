var aws = require('node-aws').createClient(
  'yourAccessKeyId',
  'yourSecretAccessKey',
  // You can optionally provide a hash of service endpoints,
  // but they each have reasonable defaults (typically US-East-1).
  {
    'sdb': 'sdb.eu-west-1.amazonaws.com',
  }
);
// All method request return a promise that will be fulfilled
// once the response is received and parsed.
aws.ec2.putAttributes(
  {
    domainName: "test",
    itemName: "item1",
    attributes: [
      {
        name: 'foo',
        value: 'bar',
      },
    ],
  }
).onSuccess(function() {
  // it worked!
  console.log(this.requestId, this.data);
}).onFailure(function() {
  // uh oh!
  console.log(this.requestId, this.error);
});

Aws = function () {

};
/* EC2 */
Aws.prototype.initWebserverAmi = function () {

};
Aws.prototype.initApiAmi = function () {

};
Aws.prototype.initRedisMqAmi = function () {

};
Aws.prototype.initRealtimeAmi = function () {

};
/* AutoScaling */
Aws.prototype.createWebserverLaunchConfiguration = function () {

};
Aws.prototype.createApiLaunchConfiguration = function () {

};
Aws.prototype.createWebserverAutoScalingGroup = function () {

};
Aws.prototype.createApiAutoScalingGroup = function () {

};
/* SNS */
Aws.prototype.createTopics = function () {
  aws.sns.createTopic({
    domainName: "test",
    itemName: "alarm",
    attributes: [{
      name: 'Name',
      value: 'alarm',
    }, ],
  }).onSuccess(function () {
    // it worked!
    console.log(this.requestId, this.data);
  }).onFailure(function () {
    // uh oh!
    console.log(this.requestId, this.error);
  });
};
Aws.prototype.listTopics = function () {};
Aws.prototype.listSubscriptions = function () {};
Aws.prototype.subscribe = function () {};
Aws.prototype.confirmSubscriptions = function () {};
exports.Aws = Aws;