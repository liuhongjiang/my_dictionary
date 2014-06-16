var express = require('express');
var router = express.Router();
var getword = require('../getword/getword')

/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });

// router.get('/w/12', function(req, res) {
router.get('/:word', function(req, res) {
    console.log(req.params.word);
    // res.end("haha : " + req.params.word);
    var obj = {"haha": req.params.word};
    getword.getAndDivide(req, res);
    // console.log("lhj is here")
    // console.log(pron)
    // res.end(JSON.stringify(pron));
})

module.exports = router;
