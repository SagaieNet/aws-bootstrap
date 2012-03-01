module.exports = function (app) {
  app.get('/', app.auth, function (request, response) {
    request.accepts('application/json');
    console.log('post body: ' + JSON.stringify(request.params));
    console.log('post body: ' + JSON.stringify(request.body.read));
  });
}