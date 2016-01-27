// fakeapi 
var fakeApiDao = require('../dao/FakeApiDao'); 
var instance = require('../instance');
module.exports = {
    /* 添加接口
     * @param {Object} doc
     * @param {Function} callback(data) 
    */
    create:function(doc,callback){
        doc = doc || {};
        if(!doc.ownerid){
            doc.ownerid = instance.getCurrentUserid();
        }
        var finder = fakeApiDao.create(doc);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 修改接口
     * @param {String} id / {Object} id
       @param {Object} doc
     * @param {Function} callback(data) 
    */
    update:function(id,doc,callback){
        doc = doc || {}; 
        if(typeof id === 'string'){
            id = {_id:id};
        }
        var finder = fakeApiDao.findAndUpdate(id,doc);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 接口名suggest
     * @param {string} word
     * @param {Function} callback(data) 
    */
    suggest: function(word,callback){
        word = word || '';
        var reg = new RegExp(word+'.*','ig');
        var finder = fakeApiDao.getByQuery({apiname: { $regex: reg }});
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 查询接口
     * @param {Object} condition
     * @param {Object} options {sort,limit}
     * @param {Function} callback(data) 
    */
    getByQuery: function(condition,options,callback){
        condition = condition || {};
        var finder = fakeApiDao.getByMutilQuery(condition,options);
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
        var finder = fakeApiDao.delByIds(id);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    }
}