var express = require('express');
var router = express.Router();
var Note = require('../operation/note');

/* GET users listing. */
router.post('/getMsg', function(req,res,next){
  var note = new Note(req,res,next);
  note.getMsg()
});
router.post('/create', function(req,res,next){
  var note = new Note(req,res,next);
  note.create()
});

module.exports = router;
