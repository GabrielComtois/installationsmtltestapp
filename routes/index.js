var express = require('express');
var http = require('http');
var winston = require('winston');
var csv = require('csv');
var raml2html = require('raml2html');
var pools = require('../lib/fetcher.js');
var db = require('../lib/db');
var mongodb = require('mongodb');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  
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
            if(err){
              winston.error(err);
              res.sendStatus(500);
            }else{
              res.json(result.sort((a, b)=> {return a.nom - b.nom;}));
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

router.get('/getPools', function(req, res) {
  pools.getPools((err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});
router.get('/getRinks', function(req, res) {
  pools.getRinks((data) => {
      res.json(data);
  });
});



module.exports = router;