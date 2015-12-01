// serverconfig api
var serverconfig = require('../dao/ServerConfigDao');
var instance = require('../instance');
module.exports = {
    /* 添加 ServerConfig
     * @param {Object} doc
     * @param {Function} callback(data)
     */
    create:function(doc,callback){
        doc = doc || {};
        var finder = ServerConfigDao.create(doc);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 修改 ServerConfig
     * @param {String} id / {Object} id
     @param {Object} doc
     * @param {Function} callback(data)
     */
    update:function(id,doc,callback){
        doc = doc || {};
        if(!id){
            id = {_id:instance.getCurrentUserid()};
        }
        else if(typeof id === 'string'){
            id = {_id:id};
        }
        var finder = ServerConfigDao.update(id,doc);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 获取用户
     * @param {string} name
     * @param {Function} callback(data)
     */
    getByUserid: function(userId,callback){
        var finder = ServerConfigDao.getOne({_id:userId});
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    }
}