var express = require('express');
var router = express.Router();
var User = require('../operation/user');

/* GET users listing. */
router.post('/authorize/send_code', function(req,res,next){
  var user = new User(req,res,next);
  user.sendCode()
});
router.post('/authorize/set_phone', function(req,res,next){
  var user = new User(req,res,next);
  user.setPhone()
});
router.post('/authorize/set_wxcode', function(req,res,next){
  var user = new User(req,res,next);
  user.setWxCode()
});
router.post('/following', function(req,res,next){
  var user = new User(req,res,next);
  user.following()
});
router.post('/unfollow', function(req,res,next){
  var user = new User(req,res,next);
  user.unfollow()
});

module.exports = router;
