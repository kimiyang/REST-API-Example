var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/userlist', function(req, res, next) {
  let db = req.db;
  var collection = db.get('userlist');
  collection.find({},{},function(e,docs){
    res.json(docs);
  })
});

router.post('/adduser', function(req,res,next){
  let db = req.db;
  console.log(req.body);
  let collection = db.get('userlist');
  collection.insert(req.body, function(err,result){
    res.send(err === null ? {msg: ''} : {msg: err});
  });
});

router.delete('/deleteuser/:id', function(req,res){
  let db = req.db;
  let collection = db.get('userlist');
  let userToDelete = req.params.id;
  console.log(userToDelete);
  collection.remove({'_id':userToDelete}, function(err){
    res.send((err === null) ? {msg : ''} : {msg: 'error: ' + err});
  });
});

module.exports = router;
