/* mq.sh */
/**
 * A plugin for circumventing SSH in applications and executing command line arguments.
 */
var fs = require('fs'),
  mqtt = require('mqttjs');
var Plugin = {
  name: 'mqsh',
  type: 'lone'
};
function getId() {
  var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
  return (S4() + S4() + " - " + S4() + " - " + S4() + " - " + S4() + " - " + S4() + S4() + S4());
}
this.name = Plugin.name;
this.type = Plugin.type;
this.run = function (constants, utilities, logger, callback) {
  self = this;
  self.constants = constants;
  self.utilities = utilities;
  self.logger = logger;
  var host = self.constants.strings.BROKER_URL;
  var port = self.constants.strings.BROKER_PORT;
  self.utilities.getInstanceId(function (instanceId) {
    console.log('Found instance ID: ' + instanceId);
    mqtt.createClient(port, host, function (client) {
      self.mq = client;
      client.connect({
        keepalive: 30,
        versionNum: 3.1,
        client: host + getId(),
        will: {
          topic: '/will',
          payload: '{"message":"death"}',
          qos: '1',
          retain: 'true'
        }
      });
      client.on('connack', function (packet) {
        console.log('connack');
        for (var i in packet) {
          console.log('packet: ' + i + ', ' + packet[i]);
        }
        client.subscribe({
          dup: false,
          messageId: Math.floor(65535 * Math.random()),
          topic: 'io.m2m/' + instanceId + '/ctrl',
          qos: 1
        });
        client.on('publish', function (packet) {
          console.log('Received event: ' + new String(packet.payload).trim());
          try {
            var payload = JSON.parse(packet.payload.trim());
            var command = payload.command;
            self.logger.write(self.constants.levels.INFO, 'Command to execute: ' + command); 
            self.logger.write(self.constants.levels.INFO, 'Decoded: ' + decodeURIComponent(command));
            command = decodeURIComponent(command);
            var exec = require('child_process').exec, child;
            child = exec(command, function (error, stdout, stderr) {
              self.logger.write(self.constants.levels.INFO, stdout.toString());
            });
          } catch (Exception) {
            self.logger.write('Error parsing payload action');
          }
        });
        client.on('close', function () {
          console.log('connection closed');
        });
        client.on('error', function (e) {
          console.log('error %s', e);
        });
        client.on('subscribe', function (packet) {
          if (packet.returnCode === 0) {
            console.log('subscribed');
          } else {
            console.log('connack error %d', packet.returnCode);
          }
        });
      });
    });
  });
};