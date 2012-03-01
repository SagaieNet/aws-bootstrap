/* keyspaces.js */
/**
 * A plugin for monitoring Cassandra keyspace directory sizes, in KB. 
 */
var fs = require('fs'),
  walker = require('walker'),
  rest = require('restler');
var Plugin = {
  name: 'keyspaces',
  command: '',
  type: 'poll'
};
this.name = Plugin.name;
this.type = Plugin.type;
Plugin.format = function (diskToCheck, data) {
  data = data.replace(/(\r\n|\n|\r)/gm, '');
  data = data.replace('%', '');
  data = {
    disk: diskToCheck,
    size: data
  };
  return JSON.stringify(data);
};
this.poll = function (constants, utilities, logger, callback) {
  var self, keyspaces = [];
  self = this;
  self.constants = constants;
  self.utilities = utilities;
  self.logger = logger;
  walker('/mnt/cassandra/data').filterDir(function (keyspace, stat) {
    self.logger.write(self.constants.levels.INFO, 'Keyspace: ' + keyspace);
    if (!self.utilities.isKeyspaceToMonitor(keyspace)) {
      self.logger.write(self.constants.levels.INFO, 'Skipping keyspace: ' + keyspace);
      return false;
    } else {
      self.logger.write(self.constants.levels.INFO, 'Found keyspace: ' + keyspace);
    }
    return true;
  }).on('dir', function (keyspace, stat) {
    self.logger.write(self.constants.levels.INFO, 'Checking keyspace directory: ' + keyspace);
    Plugin.command = 'du ' + keyspace + ' | awk {\'print$1\'}';
    var exec = require('child_process').exec,
      child;
    child = exec(Plugin.command, function (error, stdout, stderr) {
      if (!utilities.isEmpty(stdout.toString())) {
        var segments = [],
          name;
        segments = keyspace.split('/');
        name = segments[segments.length - 1];
        self.utilities.getCustomerPrefix(function (customerPrefix) {
          if (keyspace.indexOf('snapshots') != -1) {
            self.logger.write(self.constants.levels.INFO, 'Ignoring snapshot keyspace ' + name);
          } else {
            if (name.length < 32) {
              self.logger.write(self.constants.levels.INFO, 'Name of keyspace to POST for m2mIO: ' + name);
              self.logger.write(self.constants.levels.INFO, 'Prefix: m2mIO, Keyspace: ' + name + ', Size: ' + stdout.toString().trim() + ', ID: ' + process.env[self.constants.strings.INSTANCE_ID]);
              rest.post('https://api.cassandra.io/1/instanceDataSize', { data: { size: stdout.toString().trim(), prefix: 'm2mIO', instanceid: process.env[self.constants.strings.INSTANCE_ID], keyspace: name }}).on('complete', function (body, response) {
                self.logger.write(self.constants.levels.INFO, 'Response status: ' + response.statusCode);
              });
            } else {
              self.logger.write(self.constants.levels.INFO, 'Name of keyspace to POST: ' + name);
              self.logger.write(self.constants.levels.INFO, 'Prefix: ' + name.substr(0, 32) + ', Keyspace: ' + name.substr(32, name.length) + ', Size: ' + stdout.toString().trim() + ', ID: ' + process.env[self.constants.strings.INSTANCE_ID]);
              rest.post('https://api.cassandra.io/1/instanceDataSize', { data: { size: stdout.toString().trim(), prefix: name.substr(0, 32), instanceid: process.env[self.constants.strings.INSTANCE_ID], keyspace: name.substr(32, name.length) }}).on('complete', function (body, response) {
                self.logger.write(self.constants.levels.INFO, 'Response status: ' + response.statusCode);
              });
            }
          }
        });
      }
    });
  }).on('error', function (er, entry, stat) {
    self.logger.write(self.constants.levels.INFO, 'Found error ' + er + ' on entry ' + entry);
  }).on('end', function () {
    self.logger.write(self.constants.levels.INFO, 'All keyspaces traversed.');
  });
};