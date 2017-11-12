var express = require('express');
var http = require('http');
var winston = require('winston');
var csv = require('csv');
var pools = require('../lib/fetcher.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
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