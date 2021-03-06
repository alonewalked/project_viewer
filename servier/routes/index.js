var express = require('express');
var router = express.Router();
var service = require("../apis/services");

/* GET home page.
router.get('/', function(req, res) {
  return res.sendfile('views/index.html');
}); */

// 接口
router.get('/api/login', service.login);
///////////////project/////////service.getData/////////////
router.get("/api/get_data", service.getData); 
router.get("/api/get_serverconf", service.getServerConf); 
router.post("/api/create_project", service.createProject);
router.post("/api/create_branch", service.createBranch);
router.post("/api/send_weekly", service.sendWeekly);
router.post('/api/upd_project', service.updProject);
router.get('/api/open_folder', service.openFolder);

module.exports = router;