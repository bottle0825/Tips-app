var express = require('express');
var router = express.Router();
var Tips = require('../operation/tips');
var multer = require('multer');

var upload = multer({dest: 'uploads/'});

/* GET users listing. */
router.post('/getMsg', function(req,res,next){
  var tips = new Tips(req,res,next);
  tips.getMsg()
});
router.post('/getDetail', function(req,res,next){
  var tips = new Tips(req,res,next);
  tips.getDetail()
});
router.post('/create',upload.single('file'), function(req,res,next){
  var tips = new Tips(req,res,next);
  tips.create()
});
router.post('/delete', function(req,res,next){
  var tips = new Tips(req,res,next);
  tips.delete()
});
router.post('/edit', function(req,res,next){
  var tips = new Tips(req,res,next);
  tips.edit()
});

module.exports = router;
