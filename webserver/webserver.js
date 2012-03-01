module.exports = function (app) {
  app.get('/public/*', function (request, response) {
    response.sendfile(__dirname + request.url);
  });
  app.get('/twitterbootstrap', function (request, response) {
    response.render('twitterbootstrap/index.html', {
      locals: {
        title: 'yc-bootstrap | twitter bootstrap'
      }
    });
  });
  app.get('/boilerplate', function (request, response) {
    response.render('boilerplate/index.html', {
      locals: {
        title: 'yc-bootstrap | html5 boilerplate'
      }
    });
  });
}