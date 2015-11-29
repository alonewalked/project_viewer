var testUserDao = require('../dao/TestUserDao');
// var instance = require('../instance');
var error;
module.exports = {
    /* 添加
     * @param {Object} doc
     * @param {Function} callback(data) 
    */
	create : function(doc, callback){
		doc = doc || {};
        var finder = testUserDao.create(doc);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
	},
	/* 根据获取测试账号
     * @param {Object} condition
     * @param {Function} callback 
    */
    getByQuery: function(condition,callback){
        condition = condition || {};
        var finder = testUserDao.getByQuery(condition);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
}