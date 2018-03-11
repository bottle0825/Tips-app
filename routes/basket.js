var express = require('express');
var router = express.Router();
var Basket = require('../operation/basket');

/* GET home page. */
router.post('/getMsg', function(req, res, next) {
  var basket = new Basket(req, res, next);
  basket.getMsg();
});
router.post('/recover', function(req, res, next) {
  var basket = new Basket(req, res, next);
  basket.recover();
});
router.post('/delete', function(req, res, next) {
  var basket = new Basket(req, res, next);
  basket.delete();
});

module.exports = router;
