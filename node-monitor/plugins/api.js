/* api.js */
/**
 * A generic plugin for triggering actions via an API, and monitoring the results.
 */
Plugin = {};
this.name = 'api';
this.type = 'lone';
this.run = function (constants, utilities, logger, callback) {
  var self, express, app, ec2;
  self = this;
  self.constants = constants;
  self.utilities = utilities;
  self.logger = logger;
  self.logger.write(self.constants.levels.INFO, 'AWS key: ' + process.env['amazon_key']);
  self.logger.write(self.constants.levels.INFO, 'AWS secret: ' + process.env['amazon_secret']);
  ec2 = require('ec2');
  ec2Client = ec2.createClient({ key: process.env['amazon_key'], secret: process.env['amazon_secret']});
  express = require('express'), app = express.createServer();
  app.configure(function () {
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.set('view options', {
      layout: false
    });
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.renderJson = function (status, message, detail) {
    var response = {
      'Status': status,
      'Message': message,
      'Detail': detail
    }
    return response;
  };
  /* Test */
  app.get('/cassandraio/test', function (request, response) {
    response.json(app.renderJson('200', 'Success.', 'Tested issued successfully.'));
  });
  /* Restore Cassandra data */
  app.get('/cassandraio/restore/:prefix/:day', function (request, response) {
    var command = 'sudo /home/ubuntu/backup_cassandra.sh restore ' + request.params.prefix + ' ' + request.params.day + ' >> /home/ubuntu/restore.log 2>&1 &';
    var exec = require('child_process').exec, child;
    child = exec(command, function (error, stdout, stderr) {
      self.logger.write(self.constants.levels.INFO, stdout.toString());
    });
    response.json(app.renderJson('200', 'Success.', 'Command issued successfully.'));
  });
  /* Backup Cassandra data */
  app.get('/cassandraio/backup', function (request, response) {
    var command = 'sudo /home/ubuntu/backup_cassandra.sh backup >> /home/ubuntu/backup.log 2>&1 &';
    var exec = require('child_process').exec, child;
    child = exec(command, function (error, stdout, stderr) {
      self.logger.write(self.constants.levels.INFO, stdout.toString());
    });
    response.json(app.renderJson('200', 'Success.', 'Command issued successfully.'));
  });
  /* Terminate AMI self */
  app.get('/ec2/terminateself', function (request, response) {
    self.utilities.getInstanceId(function (instance) {
      self.logger.write(self.constants.levels.INFO, 'Terminating instance: self - ' + instance);
      response.json(app.renderJson('200', 'Success.', 'Instance: ' + instance + ' terminated successfully.'));
      /*
      ec2Client.call('CreateTags', { ResourceId: instance, 'Tag.1.Key': 'Name', 'Tag.1.Value':'Cassandra Enterprise AMI' }, function (response) {
        
      });
      */
      ec2Client.call('TerminateInstances', { InstanceId: instance }, function (response) {
        
      });
      ec2Client.execute();
    });
  });
  app.listen(8081);
};