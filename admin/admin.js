module.exports = function (app) {
  app.get('/', app.auth, function (request, response) {
    request.accepts('application/json');
    console.log('post body: ' + JSON.stringify(request.params));
    console.log('post body: ' + JSON.stringify(request.body.read));
  });
  app.post('/aws/ec2/terminate', function (request, response) {

  }); 
  app.post('/aws/sns', function (request, response) {
    request.accepts('application/json');
    console.log('post body: ' + JSON.stringify(request.params));
    console.log('post body: ' + JSON.stringify(request.body.read));
  });  
  app.post('/zendesk/ticket', function (request, response) {

  });
  app.post('/twilio/sms', function (request, response) {

  });
  app.post('/twilio/call', function (request, response) {

  });
  app.post('/email', function (request, response) {

  });
}