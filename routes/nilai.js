var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('nilai', { title: 'Express' });
});

/* GET home page. */
router.get('/inputnilai', function(req, res) {
  res.render('inputnilai', { title: 'Express' });
});

module.exports = router;
