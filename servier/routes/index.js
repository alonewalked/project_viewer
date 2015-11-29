var express = require('express');
var router = express.Router();
var service = require("../apis/services");

/* GET home page.
router.get('/', function(req, res) {
  return res.sendfile('views/index.html');
}); */

// 接口
router.get("/api/get_data", service.getData); 
module.exports = router;