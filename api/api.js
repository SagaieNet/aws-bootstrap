module.exports = function (app) { 
  app.createResponse()
  app.get("/", app.auth, function (request, response) {
    response.json(app.response("401", "Not authorized.", "No credentials supplied."));
  });
  app.post("/analytics/visitors", app.auth, function (request, response) {
    console.log('new project');
    var id;
    id = new Date().getTime();
    console.log("id:" + id + "body: " + JSON.stringify(request.body));
    app.write();
    app.read();
  }); 
  app.post("/webservice/twilio/sms", app.auth, function (request, response) {
   
  });
}

function v1(req, res, next) {
  res.send('hello ' + req.params.name);
  return next();
}
var server = restify.createServer();
server.pre(function(req, res, next) {
  req.headers.accept = 'application/json'; 
  return next();
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.conditionalRequest());
server.listen(80, function() {
  console.log('%s listening at %s', server.name, server.url);
});
server.post('/webservice/aws/subscribe', function create(req, res, next) {
  res.send(201, Math.random().toString(36).substr(3, 8));
  return next();
});
server.get('/', send);