var express = require('express');
var http = require('http');
var winston = require('winston');
var raml2html = require('raml2html');
var db = require('../lib/db');
var fetcher = require('../lib/fetcher');
var mongodb = require('mongodb');
var json2xml = require('json2xml');
var json2csv = require('json2csv');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  fetcher.initDataBase();
  db.getConnection((err, db)=>{
    db.collection('installations', (err, collection)=>{
      if(err){
        winston.error(err);
        res.sendStatus(500);
      }else{
        var inst = collection.distinct("nom").then((result)=>{
          res.render('index',{title:'INF4375 - Installations de la Ville de Montreal',installations:result});
        });    
      }
    });
  });


});

/* GET doc page. */
router.get('/doc', function(req, res) {
  var config = raml2html.getConfigForTheme();
  var onError = (err)=>{
    winston.error(err);
    res.sendStatus(500);
  };
  var onSuccess = (html)=>{
    res.send(html);
  };
  raml2html.render("routes/doc/index.raml", config).then(onSuccess, onError);
});

//get installation
//param: arrrondissement
router.get('/installations',(req,res)=>{
 db.getConnection((err, db)=>{
    db.collection('installations', (err, collection)=>{
      if(err){
        winston.error(err);
        res.sendStatus(500);
      }else{
        if(req.query.arrondissement!=null){
          console.log(req.query.arrondissement);
          collection.find({$or:[{"arrondissement":req.query.arrondissement},{"arrondissement.0.nom_arr.0":req.query.arrondissement}]}).toArray((err,result)=>{
            if(err){
              winston.error(err);
              res.sendStatus(500);
            }else{
              res.json(result);
            }
          });
        }else if(req.query.condition!=null){
          collection.find({"condition.0":req.query.condition}).toArray((err,result)=>{
            console.log(result);
            if(err){
              winston.error(err);
              res.sendStatus(500);
            }else{
              if(req.query.format!=null){
                if(req.query.format=="xml"){
                  result = result.sort((a, b)=> {return a.nom - b.nom;})
                  res.header("Content-Type", "text/xml; charset=utf-8");
                  var response = {'patinoires': result};
                  res.send('<?xml version="1.0" encoding="UTF-8"?>'+json2xml(response));
                }else if(req.query.format=='csv'){
                  result = result.sort((a, b)=> {return a.nom - b.nom;})
                  var fields = ['_id', 'nom', 'arrondissement','ouvert','deblaye','arrose','resurface','condition'];
                  var csvData = json2csv({ data: result, fields: fields });
                  res.header("Content-Type", "application/octet-stream; charset=utf-8");
                  res.send(csvData);
                }
              }else{
                  res.json(result.sort((a, b)=> {return a.nom - b.nom;}));
              }
            }
          });
        }else if(req.query.nom!=null){
          collection.find({"nom":req.query.nom}).toArray((err,result)=>{
            if(err){
              winston.error(err);
              res.sendStatus(500);
            }else{
                res.json(result.sort((a, b)=> {return a.nom - b.nom;}));
            }
          });
        }
      }
    });
  });
});


module.exports = router;