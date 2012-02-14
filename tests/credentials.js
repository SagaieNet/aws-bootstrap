require('./setup');

var credentials = require('../credentials');
console.log(credentials.api_username);
console.log(credentials.api_password);
console.log(credentials.aws_account_id);
console.log(credentials.aws_key);
console.log(credentials.aws_secret);
console.log(credentials.s3_bucket);
console.log(credentials.github_username);
console.log(credentials.github_password);
console.log(credentials.github_account_name);
// console.log(credentials.twilio_account_sid);
// console.log(credentials.twilio_auth_token);