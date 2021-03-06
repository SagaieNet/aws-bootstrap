/* client.js */
/* To run: node client.js ec2=true/false debug=true/false console=true/false cloudwatch=true/false */
var fs = require('fs'),
  location = 'client.js'; 
/* Error handling */
require('long-stack-traces');
process.on('uncaughtException', function (error) {
  console.log('Caught unhandled node.js exception: ' + error);
}); 
/* Path to dependencies from file */
var modules = {
  constantsModule: '../submodules/constants',
  utilitiesModule: '../submodules/utilities',
  credentialsModule: '../modules/credentials',
  daoModule: '../modules/dao',
  pluginsModule: '../modules/plugins',
  loggerModule: '../modules/logger'
}; 
/* Setup dependencies */
for (var name in modules) { 
/* Debug */
  /* console.log('Evaluating dependency in location: ' + location + ', with name: ' + name + ', path:' + modules[name]); */
  eval('var ' + name + ' = require(\'' + modules[name] + '\')');
}
function NodeMonitor() {
  this.init = function (callback) {
    var constants = new constantsModule.ConstantsManagerModule();
    var utilities = new utilitiesModule.UtilitiesManagerModule(constants);
    var logger = new loggerModule.LoggingManagerModule(constants, utilities);
    var credentials = new credentialsModule.CredentialManagerModule(constants, utilities, logger);
    var dao = new daoModule.DaoManagerModule(constants, utilities, logger);
    var plugins = new pluginsModule.PluginsManagerModule(constants, utilities, logger, dao);
    this.plugins = plugins; 
    /* Parse configuration */
    utilities.parseConfig(constants.strings.MONITOR_CONFIG_FILE, function () { 
    /* Parse command line options */
      utilities.parseCommandLineOptions(function () { 
      /* Validate credentials */
        credentials.check(function () {
          utilities.getInstanceId(function (id) {
            process.env[constants.strings.INSTANCE_ID] = id;
          });
          callback();
        });
      });
    });
  };
}
var nodeMonitor = new NodeMonitor();
nodeMonitor.init(function () {
  nodeMonitor.plugins.start();
});