var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LCMC Community Relations Data Access' });
  // res.json('asdasdasd');
});

module.exports = router;
