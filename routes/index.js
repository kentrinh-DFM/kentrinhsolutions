var express = require('express');
var router = express.Router();
const request = require('request')

router.get('/', function(req, res, next) {
    res.render('index', { title: "IBM Script" });
});

module.exports = router;