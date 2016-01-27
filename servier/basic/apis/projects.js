// project api 
var projectDao = require('../dao/ProjectDao'); 
var instance = require('../instance');
module.exports = {
    /* 添加 project
     * @param {Object} doc
     * @param {Function} callback(data)
    */
    create:function(doc,callback){
        doc = doc || {};
        if(!doc.ownerid){
            doc.ownerid = instance.getCurrentUserid();
        }
        var finder = projectDao.create(doc);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 修改 project
     * @param {String} id / {Object} id
       @param {Object} doc
     * @param {Function} callback(data) 
    */
    update:function(id,doc,callback){
        doc = doc || {}; 
        if(typeof id === 'string'){
            id = {_id:id};
        }
        var finder = projectDao.findAndUpdate(id,doc);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
        
    },
    /* 根据用户获取 project
     * @param {string} uid 用户id
     * @param {Function} callback(data) 
    */
    getByUser: function(uid,callback){
        uid = uid || instance.getCurrentUserid();
        var finder = projectDao.getByQuery({ownerid:uid});
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
        
    },
    /* 根据获取Project
     * @param {Object} condition
       @param {Object} options {sort,limit,no,pagesize,ref}
     * @param {Function} callback(data) 
    */
    getByQuery: function(condition,options,callback){
        condition = condition || {};
        var finder = projectDao.getByMutilQuery(condition,options);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* project suggest
     * @param {string} word
     * @param {Function} callback(data) 
    */
    suggest: function(word,callback){
        word = word || '';
        var reg = new RegExp(word+'.*','ig');
        var finder = projectDao.getByQuery({name: { $regex: reg }});
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
        
    },
    /* 获取相关api
     * @param {string} pid project id
     * @param {Function} callback(data) 
    */
    getApisFromProject: function(pid,callback){
        var finder = projectDao.findPopulate(pid,'apialiasid');
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 获取最后一个项目
     * @param {Function} callback(data) 
    */
    getLastProject: function(callback){
        var finder = projectDao.getOne({},{
            limit:1,
            sort:'-launchdate'
        });
        if(callback){
           return finder.then(callback,callback); 
        }
        else{
            return finder;
        }
    },
    /* 添加测试页
     * @param {string} pid project id
     * @param {string} url 链接地址
     * @param {Function} callback(data) 
    */
    addTestPage: function(pid,url,callback){
        var finder = projectDao.findAndUpdate({"_id":pid}, {'$addToSet':{"testpages":url}});
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 添加测试接口
     * @param {string} pid project id
     * @param {string} aid 接口id
     * @param {Function} callback(data) 
    */
    addTestApi: function(pid,aid,callback){
        var finder = projectDao.findAndUpdate({"_id":pid}, {'$addToSet':{"apialiasid":aid}});
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 设置项目状态
     * @param {String} pid project id
     * @param {Number} state 状态
     * @param {Function} callback(data) 
    */
    setProjectStatus: function(pid,state,callback){
        return this.update({_id:pid},{status:state},callback);
    }
}