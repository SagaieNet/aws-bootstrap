var express, app;
express = require("express"), app = express.createServer();
app.configure(function () {
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
  app.set("view options", {
    layout: false
  });
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
require("./auth")(app);
require("./api")(app);
app.listen(80);