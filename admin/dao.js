var redis = require("redis"), client = redis.createClient();
module.exports = function (app) { 
  app.write = function() {
    console.log("Setting data");
  }
  app.read = function() {
    console.log("read data");
  }
}