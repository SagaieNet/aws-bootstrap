/* cron.js */
/**
 * A generic plugin for triggering X at Y intervals.
 */
var Plugin = {
  name: 'cron',
  command: '',
  type: 'lone'
};
this.name = Plugin.name;
this.type = Plugin.type;
Plugin.makeRequest = function(url, callback) {
  var rest;
  rest = require('restler');
  rest.get('http://127.0.0.1:8081' + url).on('complete', function(result) {
    if (result instanceof Error) {
      self.logger.write(self.constants.levels.INFO, 'Error: ' + result.message);
      callback(false);
    } else {
      self.logger.write(self.constants.levels.INFO, 'Response: ' + JSON.stringify(result));
      callback(true);
    }
  });
}
Plugin.test = function(callback) {
  Plugin.makeRequest('/cassandraio/test', function(status) {
    callback(status);
  });
};
Plugin.backupCassandra = function(callback) {
  Plugin.makeRequest('/cassandraio/backup', function(status) {
    callback(status);
  });
};
this.run = function (constants, utilities, logger, callback) {
  var self, cron;
  self = this;
  self.constants = constants;
  self.utilities = utilities;
  self.logger = logger;
  cron = require('cron').CronJob;
  /* Run API test every 5 minutes */
  cron('0 */5 * * * *', function(){
    self.logger.write(self.constants.levels.INFO, 'Running API test');
    Plugin.test(function(ok) {
      self.utilities.getCustomerPrefix(function (customerPrefix) {
        self.logger.write(self.constants.levels.INFO, 'Prefix: ' + customerPrefix);
        self.utilities.getToken(function (token) {
          self.logger.write(self.constants.levels.INFO, 'Token: ' + token);
            if (!ok) {
              callback(Plugin.name, 'ApiCassandraIONode-' + customerPrefix + '-' + token, 'None', '0');
            } else {
              callback(Plugin.name, 'ApiCassandraIONode-' + customerPrefix + '-' + token, 'None', '1');
            }
        });
      });
    }); 
  });
  /* Trigger Cassandra backup via API every night at 10:30 */
  cron('00 30 5 * * *', function(){
    self.logger.write(self.constants.levels.INFO, 'Backing up Cassandra');
    Plugin.backupCassandra(function(ok) {
      self.utilities.getCustomerPrefix(function (customerPrefix) {
        self.logger.write(self.constants.levels.INFO, 'Prefix: ' + customerPrefix);
        self.utilities.getToken(function (token) {
          self.logger.write(self.constants.levels.INFO, 'Token: ' + token);
            if (!ok) {
              callback(Plugin.name, 'BackupCassandraIONode-' + customerPrefix + '-' + token, 'None', '0');
            } else {
              callback(Plugin.name, 'BackupCassandraIONode-' + customerPrefix + '-' + token, 'None', '1');
            }
         });
      });
    }); 
  });
};

