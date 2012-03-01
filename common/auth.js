module.exports = function (app) {
  app.auth = function (request, response, next) {
    if (request.headers.authorization && request.headers.authorization.search('Basic ') === 0) {
      if (new Buffer(request.headers.authorization.split(' ')[1], 'base64').toString() == 'username:password') {
        console.log('accepted username password')
        next();
        return;
      }
    }
    console.log('Unable to authenticate request');
    response.header('WWW-Authenticate', 'Basic realm="Admin Area"');
    if (request.headers.authorization) {
      console.log('Credentials: ' + request.headers.authorization);
      setTimeout(function () {
        response.json(app.response('401', 'Not authenticated', 'Check that supplied credentials are valid'));
      }, 5000);
    } else {
      response.json(app.response('401', 'Not authenticated', 'Please supply credentials'));
    }
  }
}