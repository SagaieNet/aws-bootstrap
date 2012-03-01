/* nodetool.js */
/**
 * A plugin for monitoring Cassandra node status.
 */
var fs = require('fs');
var Plugin = {
  name: 'nodetool',
  command: 'nodetool ring -h localhost -p 7199',
  type: 'poll'
};
this.name = Plugin.name;
this.type = Plugin.type;
this.poll = function (constants, utilities, logger, callback) {
  self = this;
  self.constants = constants;
  self.utilities = utilities;
  self.logger = logger;
  var exec = require('child_process').exec,
    child;
  child = exec(Plugin.command, function (error, stdout, stderr) {
    self.utilities.getCustomerPrefix(function (customerPrefix) {
      var status;
      if (stdout.toString().indexOf('Down') != -1) {
        status = '0';
      } else {
        status = '1';
      }
      callback(Plugin.name, 'DownedCassandraIONode-' + customerPrefix, 'None', status);
    });
  });
};