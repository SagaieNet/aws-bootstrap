function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  });
}
define('api_username', process.env['api_username']);
define('api_password', process.env['api_password']);
define('aws_account_id', process.env['aws_account_id']);
define('aws_key', process.env['aws_key']);
define('aws_secret', process.env['aws_secret']);
define('s3_bucket', process.env['s3_bucket']);
define('github_username', process.env['github_username']);
define('github_password', process.env['github_password']);
define('github_account_name', process.env['github_account_name']);
// define('twilio_account_sid', process.env['twilio_account_sid']);
// define('twilio_auth_token', process.env['twilio_auth_token']);