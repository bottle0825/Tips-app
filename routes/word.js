var express = require('express');
var router = express.Router();
var Word = require('../operation/word');

/* GET home page. */
router.post('/add', function(req, res, next) {
    var word = new Word(req, res, next);
    word.add();
});
router.post('/getMsg', function(req, res, next) {
    var word = new Word(req, res, next);
    word.getMsg();
});
router.post('/changeStatus', function(req, res, next) {
    var word = new Word(req, res, next);
    word.changeStatus();
});
module.exports = router;
