var fs = require('fs'),
  Module = {};
var modules = {
  cloudwatch: 'node-cloudwatch'
};
DaoManagerModule = function (constants, utilities, logger, dao) {
  Module = this;
  Module.constants = constants;
  Module.utilities = utilities;
  Module.logger = logger;
  Module.dao = dao; 
  /* Setup dependencies */
  for (var name in modules) {
    eval('var ' + name + ' = require(\'' + modules[name] + '\')');
  }
  var CloudwatchApi = new cloudwatch.AmazonCloudwatchClient();
  Module.cloudwatchApi = CloudwatchApi;
};
DaoManagerModule.prototype.debugMode = function () {
  if (process.env['debug'] == 'true') 
    return true;
    
  return false;
};
DaoManagerModule.prototype.write = function (pluginName, jsonString) {
  if (Module.utilities.validateData(jsonString)) 
    return true;
  Module.logger.write(Module.constants.levels.WARNING, 'Data is not valid JSON');
  return false;
};
DaoManagerModule.prototype.asciiConvert = function (string) {
  var res = '';
  for (var i = 0; i < string.length; i++) {
    res += string.charCodeAt(i) + ',';
  }
  return res.substr(0, res.length - 1);
};
DaoManagerModule.prototype.postCloudwatch = function (metricName, unit, value) { 
  /* If we're in debug mode, don't post */
  if (this.debugMode()) 
    return; 
  /* If we're not on EC2, don't post */
  if (process.env[Module.constants.strings.EC2] != Module.constants.strings.TRUE) 
    return;
  var params = {};
  params['Namespace'] = process.env[Module.constants.strings.CLOUDWATCH_NAMESPACE].trim();
  params['MetricData.member.1.MetricName'] = metricName;
  params['MetricData.member.1.Unit'] = unit;
  params['MetricData.member.1.Value'] = value;
  params['MetricData.member.1.Dimensions.member.1.Name'] = 'InstanceID';
  params['MetricData.member.1.Dimensions.member.1.Value'] = process.env[Module.constants.strings.INSTANCE_ID].trim();
  Module.logger.write(Module.constants.levels.INFO, 'CloudWatch Namespace: ' + process.env[Module.constants.strings.CLOUDWATCH_NAMESPACE]);
  Module.logger.write(Module.constants.levels.INFO, 'CloudWatch IP: ' + process.env[Module.constants.strings.INSTANCE_ID].trim());
  Module.logger.write(Module.constants.levels.INFO, 'CloudWatch MetricName: ' + metricName);
  Module.logger.write(Module.constants.levels.INFO, 'CloudWatch Unit: ' + unit);
  Module.logger.write(Module.constants.levels.INFO, 'CloudWatch Value: ' + value); 
  Module.logger.write(Module.constants.levels.INFO, 'CloudWatch? ' + process.env[Module.constants.strings.CLOUDWATCH_ENABLED]);
  if (process.env[Module.constants.strings.CLOUDWATCH_ENABLED] == Module.constants.strings.TRUE) {
    try {
      Module.cloudwatchApi.request('PutMetricData', params, function (response) {
        Module.logger.write(Module.constants.levels.INFO, 'CloudWatch response: ' + response.toString());
      });
    } catch (Exception) {
      Module.logger.write(Module.constants.levels.SEVERE, 'Error POSTing data to CloudWatch: ' + Exception);
    }
  }
  return params;
};
exports.DaoManagerModule = DaoManagerModule;