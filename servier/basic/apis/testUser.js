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
    /*
     * @param {String} multi id concat with ','
     * @param {Function} callback(data)   
    */
    delete: function(id,callback){
        id = id || '';
        if(typeof id === 'string'){
            id = id.split(',');
        }
        var finder = testUserDao.delByIds(id);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 修改测试帐号
     * @param {String} id / {Object} id
       @param {Object} doc
     * @param {Function} callback(data) 
    */
    update:function(id,doc,callback){
        doc = doc || {}; 
        if(typeof id === 'string'){
            id = {_id:id};
        }
        var finder = testUserDao.findAndUpdate(id,doc);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    }
}