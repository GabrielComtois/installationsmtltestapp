var http = require('http');
var csv = require('csv');
var parseString = require('xml2js').parseString;
var winston = require('winston');
var cron = require('node-cron');
var persistence = require('./persistence.js');
/*
 *    URL 
 */


var poolsUrl = 'http://donnees.ville.montreal.qc.ca/dataset/4604afb7-a7c4-4626-a3ca-e136158133f2/resource/cbdca706-569e-4b4a-805d-9af73af03b14/download/piscines.csv';
var rinksUrl = 'http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_PATINOIRE.xml';
var slidesUrl = 'http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_GLISSADE.xml';


/*
 * functions
 */
function getPools(cb) {
  winston.info('fecthing pools');
  var req = http.get(poolsUrl, (res) => {
    if (res.statusCode !== 200) {
      cb('Request Failed...status: ' + res.statusCode);
    } else {

      res.setEncoding('utf-8');

      var rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });

      res.on('end', () => {
          cb(rawData);
      });
    }
  }).on('error', (e) => {
    winston.error(e.message);
    cb(e);
  });
}



function getRinks(cb) {
  winston.info('fetching rinks');
  var req = http.get(rinksUrl, (res) => {
    if (res.statusCode !== 200) {
      cb('Request Failed...status: ' + res.statusCode);
    } else {

      res.setEncoding('utf-8');

      var rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });

      res.on('end', () => {
        parseString(rawData, (err, result) => {
          cb(result);
        });
      });
    }
  }).on('error', (e) => {
    winston.error(e.message);
    cb(e);
  });
}

function getSlides(cb) {
  winston.info('fecthing slides');
  var req = http.get(slidesUrl, (res) => {
    if (res.statusCode !== 200) {
      cb('Request Failed...status: ' + res.statusCode);
    } else {

      res.setEncoding('utf-8');

      var rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });

      res.on('end', () => {
        parseString(rawData, (err, result) => {
          cb(result);
        });
      });
    }
  }).on('error', (e) => {
    winston.error(e.message);
    cb(e);
  });
}



/*
 *Cron task behind executed every 30mins
 */
var task = cron.schedule('*/1 * * * *', function() {
  winston.info("cron task : fetching");

  persistence.dropTable();

  getPools((data)=>{
    persistence.poolsDataToDb(data);
  });

  getRinks((data) => {
    persistence.dataToDb(data);
  });

  getSlides((data)=>{
    persistence.dataToDb(data);
  });

}, true);