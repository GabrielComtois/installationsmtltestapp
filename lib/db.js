var mongodb = require("mongodb");

var instanceMongoDB;
var url = 'mongodb://gdcomtois:inf4375@ds013941.mlab.com:13941/inf4375';

module.exports.getConnection = function(callback) {
  console.log('connecting to mongodb');
  if (instanceMongoDB) {
    callback(null, instanceMongoDB);
  } else {
      mongodb.connect(url, function(err, db) {
        if (err) {
          console.log(err);
          callback(err);
        }
        instanceMongoDB = db;
        console.log(err);
        callback(err, db);
      });
    }
};