var express = require('express');
var router = express.Router();
var Account = require('../operation/account');

/* GET home page. */
router.post('/add', function(req, res, next) {
    var account = new Account(req, res, next);
    account.add();
});

router.post('/getDayMsg', function(req, res, next) {
    var account = new Account(req, res, next);
    account.getDayMsg();
});
router.post('/getMonthMsg', function(req, res, next) {
    var account = new Account(req, res, next);
    account.getMonthMsg();
});
router.post('/getYearMsg', function(req, res, next) {
    var account = new Account(req, res, next);
    account.getYearMsg();
});
module.exports = router;
