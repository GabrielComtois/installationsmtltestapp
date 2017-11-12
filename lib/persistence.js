var fetcher = require('./fetcher.js');
var winston = require('winston');
var EventEmitter = require('events');


fetcher.fetcherEmitter.on('poolsData', (data) => {
  winston.info('storing pool data to db');
  poolDataToDb(data);

});



function poolDataToDb(data) {

for (var d in data){
  console.log('data '+ d);
}

};