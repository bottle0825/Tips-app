var express = require('express');
var router = express.Router();
var Said = require('../operation/said');
var multer = require('multer');

var upload = multer({dest: 'uploads/'});

/* GET users listing. */
router.post('/getMsg', function(req,res,next){
  var said = new Said(req,res,next);
  said.getMsg()
});
router.post('/getMsgOther', function(req,res,next){
  var said = new Said(req,res,next);
  said.getMsgOther()
});
router.post('/create',upload.single('file'), function(req,res,next){
  var said = new Said(req,res,next);
  said.create()
});
router.post('/delete', function(req,res,next){
  var said = new Said(req,res,next);
  said.delete()
});

module.exports = router;
