Helper = function () {

};
Helper.prototype.removeEmptyLinesFromGists = function(file) {
  var str;
  str = file.value;
  while(str.indexOf('\r\n\r\n') >= 0) {
    str = str.replace(/\r\n\r\n/g, "\r\n")      
  }
  file.value = str;
};
Helper.prototype.readFileContents = function(file) {
  var fs = require('fs');
  /* Blocking */
  try {
    return fs.readFileSync(file, 'ascii');
  } catch (error) {
    console.error('There was an error reading the file contents: ' + error);
  }
};
Helper.prototype.exit = function () {
 
};
exports.Helper = Helper;