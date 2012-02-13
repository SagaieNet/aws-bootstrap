var express, app, stache;
express = require("express"), stache = require("stache"), app = express.createServer();
app.configure(function () {
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
  app.set("view options", {
    layout: true
  });
  app.set('view engine', 'mustache');
  app.register('.mustache', stache);
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});
app.response = function (status, message, detail) {
  var response = {
    'Status': status,
    'Message': message,
    'Detail': detail
  }
  return response;
};
require("./dao")(app);
require("./webserver")(app);
app.listen(80);