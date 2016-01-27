// serverconfig api
var serverDao = require('../dao/ServerConfigDao');
var instance = require('../instance');
var $q = require('q');

module.exports = {
    /* 初始化 ServerConfig
     * @param {Function} callback(data)
     */
    init:function(json, callback){
        var finder = serverDao.create(json);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 获取 ServerConfig
     * @param {Function} callback(data)
     */
    getServerConfig:function(conf,callback){
        var _check_has = function(d){
            var deferred = $q.defer();
            if(d.data && d.data.length===0){
                return this.init(conf);
            }
            else{
                deferred.resolve({
                    code:'A00000',
                    data:d.data[0]
                });
                return deferred.promise;
            }
        }
        serverDao.getByMutilQuery({},{
            limit:1
        })
        .then(_check_has.bind(this),callback)
        .then(callback,callback);
    },
    /* 获取用户
     * @param {string} name
     * @param {Function} callback(data)
     */
    getByUserid: function(userId,callback){
        var finder = serverDao.getOne({_id:userId});
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    }
}