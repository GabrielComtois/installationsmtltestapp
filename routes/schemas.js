/*
*
*https://github.com/jacquesberger/exemplesINF4375/blob/master/Ateliers/RAML/Solutions/routes/schemas.js
*/

var fs = require('fs');

schemas = {};

module.exports = {
  loadSchema: function(name, callback) {
    if (schemas[name]) {
      callback(null, schemas[name]);
    } else {
      fs.readFile("routes/schemas/" + name + ".json", function(err, data) {
        if (err) {
          callback(err);
        } else {
          schemas[name] = JSON.parse(data);
          callback(null, schemas[name]);
        }
      });
    }
  }
}