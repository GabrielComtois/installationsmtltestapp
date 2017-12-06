var winston = require('winston');
var db = require('./db');
var csv=require('csvtojson')
var mongodb = require('mongodb');

var poolsData =[];


function poolsDataToDb(data) {
  winston.info('storing pool data to db');
  db.getConnection((err, db)=>{
    db.collection('installations',(err,collection)=>{
      if(err){
        winston.error(err);
      }
      else{
        var splitData = data.split(',');

        csv({noheader:false, headers: ['col1']})
        .fromString(data)
        .on('csv', (csvRow)=>{

          var pool = {
            'id' : csvRow[0],
            'type': csvRow[1],
            'nom': csvRow[2],
            'arrondissement': csvRow[3],
            'adresse': csvRow[4],
            'propriete': csvRow[5],
            'gestion': csvRow[6],
            'point_x':csvRow[7],
            'point_y':csvRow[8],
            'equipement':csvRow[9],
            'longitude': csvRow[10],
            'latitude': csvRow[11],
          }
          collection.insert(pool);

        })
        .on('done',()=>{

        })
      }
    }); 
  });
}

function dataToDb(data) {
  winston.info('storing data to db');
  Object.entries(data).forEach(
    ([key, value]) => {
    db.getConnection((err, db)=>{
      for(var installations in value){
        installationArray = value[installations];
        for(var installation in installationArray){
          db.collection('installations',(err,collection)=>{
            if(err)
              winston.error(err);
            else{
              collection.insert(installationArray[installation]);
            }
          });
        }
      }
    });  
  });
}

function dropTable(){
  winston.info('dropping table isntallations');
  db.getConnection((err, db)=>{
    db.collection('installations',(err,collection)=>{
      if(err)
        winston.error(err);
      else
        collection.drop();
    });
  });  
}

exports.poolsDataToDb = poolsDataToDb;
exports.dataToDb = dataToDb;
exports.dropTable = dropTable;