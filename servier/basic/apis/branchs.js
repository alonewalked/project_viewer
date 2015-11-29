// branch api
var branchDao = require('../dao/branchDao');
var instance = require('../instance');
var svn = require('../utils/svn'); 
module.exports = {
    /* 添加branch
     * @param {Object} doc
     * @param {Function} callback(data) 
    */
    create:function(doc,callback){
        doc = doc || {};
        if(!doc.createBy){
            doc.createBy = instance.getCurrentUserid();
        }
        var finder = branchDao.create(doc);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 修改branch
     * @param {String} id / {Object} id
       @param {Object} doc
     * @param {Function} callback(data) 
    */
    update:function(id,doc,callback){
        doc = doc || {}; 
        if(typeof id === 'string'){
            id = {_id:id};
        }
        var finder = branchDao.update(id,doc);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 根据用户获取branch
     * @param {string} id
     * @param {Function} callback(data) 
    */
    getByUser: function(uid,callback){
        uid = uid || instance.getCurrentUserid(); 
        var finder = branchDao.getByQuery({createBy:uid});
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 根据tag获取
     * @param {string} tag
     * @param {Function} callback 
    */
    getByTag: function(tag,callback){
        tag = tag || '';
        var finder = branchDao.getByQuery({tag:tag});
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* branch suggest
     * @param {string} word
     * @param {Function} callback(data) 
    */
    suggest: function(word,callback){
        word = word || {};
        var finder = branchDao.getByQuery({name:new RegExp(word+'.*','ig')});
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 查询branch
     * @param {Object} condition
     * @param {Object} options {sort,limit,no,pagesize,ref}
     * @param {Function} callback(data) 
    */
    getByQuery: function(condition,options,callback){
        condition = condition || {};
        var finder = userDao.getByMutilQuery(condition,options);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 获取相关project
     * @param {string} bid branch id
     * @param {Function} callback(data) 
    */
    getProjectsByBranch: function(bid,callback){
        var finder = branchDao.findPopulate(bid,'projectids');
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 关联项目
     * @param {string} bid branch id
     * @param {string} pid project id
     * @param {Function} callback(data) 
    */
    setRelativeProject: function(bid,pid,callback){
        var finder = branchDao.findAndUpdate({"_id":bid}, {'$addToSet':{"projectids":pid}});
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 获取最后一条
       @param {Function} callback(data) 
    */
    getLastBranch: function(callback){
        var finder = branchDao.getOne({},{
            limit:1,
            sort:'-createtime'
        });
        if(callback){
           return finder.then(callback,callback); 
        }
        else{
            return finder;
        }
    }
}