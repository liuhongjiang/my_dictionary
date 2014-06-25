var express = require('express');
var router = express.Router();
var getword = require('../getword/getword')

router.get('/:word', function(req, res) {
    var obj = {"haha": req.params.word};
    getword.getAndDivide(req, res);
})

module.exports = router;
