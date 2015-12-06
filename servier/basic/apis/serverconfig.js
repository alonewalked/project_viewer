// serverconfig api
var serverDao = require('../dao/ServerConfigDao');
var instance = require('../instance');
var $q = require('q');

module.exports = {
    /* 初始化 ServerConfig
     * @param {Function} callback(data)
     */
    init:function(callback){
        var svn = {
            "qiyiV2":"https://scm.qiyi.domain:18080/svn/RIA/RIA/projectsV2/qiyiV2/trunk",
            "lib":"https://scm.qiyi.domain:18080/svn/RIA/RIA/lib/src/browser/trunk",
            "appstore":"https://scm.qiyi.domain:18080/svn/RIA/RIA/projectsV2/qiyiStore/trunk",
            "pingback":"https://scm.qiyi.domain:18080/svn/RIA/RIA/projects/pingback/trunk"
            };
        var pjstate = [
            {id:2.0,name:'开发中'},
            {id:2.1,name:'联调中'},
            {id:2.2,name:'已提测'},
            {id:2.3,name:'测试中'},
            {id:2.4,name:'staging'},
            {id:3,name:'已上线'},
            {id:4,name:'已暂停'},
            {id:5,name:'已终止'}];
        var finder = serverDao.create({
            "projectcategory":['qiyiV2','qiyi','lib','pingback','qiyiStore'],
            "projectfilter":['自己的项目','全部项目','正在进行的项目','已上线的项目','已暂停的项目','已终止的项目'],
            "projectsvn":JSON.stringify(svn),
            "projectstatus":JSON.stringify(pjstate)
        });
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
    getServerConfig:function(callback){
        var _check_has = function(d){
            var deferred = $q.defer();
            if(d.data && d.data.length===0){
                return this.init();
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