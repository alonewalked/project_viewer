var logsDao = require('../dao/LogDao');
var instance = require('../instance');
module.exports = {
    /* 添加log
     * @param {Object} doc
     * @param {Function} callback(data) 
    */
	create: function(doc, callback){
		doc = doc || {};
		if(!doc.userid){
            doc.userid = instance.getCurrentUserid();
        }
        var finder = logsDao.create(doc);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
	},
	/* 根据用户获取 log
     * @param {string} uid
     * @param {Function} callback 
    */
    getByUser: function(uid,callback){
        uid = uid || instance.getCurrentUserid();
        var finder = logsDao.getByQuery({userid:uid});
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
}