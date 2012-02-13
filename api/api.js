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
  app.post("/webservice/aws/subscribe", function (request, response) {
   
  });
  app.post("/webservice/twilio/sms", app.auth, function (request, response) {
   
  });
}