// svn js
var exec = require('child_process').exec;
var Path = require('path');
var os = require('os');
var $q = require('q');
var config = require('./config');

module.exports = {
    /* 更新snv
     * @param {Object} options {path:'',username:'',password:''}
     * @param {Function} callback(err) 
    */
    update:function(options,callback){
        var path = options.path;
        var cmd = 'svn update ' + path + ' --username ' +
                options.username + ' --password ' + options.password + ' --non-interactive';
        exec(cmd,function(err,stdout,stderr){
            if (callback) {
                callback(err);
            }
        });
    },
    /* 提交snv
     * @param {Object} options {path:'',username:'',password:''}
     * @param {Function} callback(err) 
    */
    commit:function(options,callback){
        var path = options.path;
        var message = options.message || 'serv_commit';
        var cmd = 'svn ci ' + path + ' -m "' + message + '" --username ' +
                options.username + ' --password ' + options.password + ' --non-interactive';
        exec(cmd,function(err,stdout,stderr){
            if (callback) {
                callback(err);
            }
        });
    },
    /* 创建snv
     * @param {Object} options {trunk:'',branch:'',username:'',password:''}
     * @param {Function} callback(err) 
    */
    create: function(options,callback){ 
        var deferred = $q.defer();
        var _trunck = options.trunk;
        var _branch = options.branch;
        var cmd = 'svn cp '+_trunck+' '+_branch+' -m proj_tool_cp --username '+ options.username + ' --password ' + options.password;
        console.log(cmd)
        exec(cmd,function(err,stdout,stderr){
            if (err) {
                deferred.reject(err);
                console.log(err);
            }
            else{
                deferred.resolve(_branch);
                console.log(stdout);
            }
        });
        return deferred.promise.nodeify(callback); 
    },
    /* checkout snv
     * @param {Object} options {branch:'',target:'',username:'',password:''}
     * @param {Function} callback(err) 
    */
    checkout:function(options,callback){ 
        var deferred = $q.defer();
        var _branch = options.branch;
        var _target = options.target;
        var cmd = 'svn checkout ' + _branch + ' '+_target+' --username '+options.username+' --password ' +options.password;
        exec(cmd,function(err,stdout,stderr){
            if (err) {
                console.log(err);
                deferred.reject(err);
            }
            else{
                console.log(stdout);
                deferred.resolve(_branch); 
            }
        });
        return deferred.promise.nodeify(callback);
    },
    /**
     * 一键部署代码
     * @param account 用户账号和密码
     * @param addressObj  ip,svn地址，部署目标地址
     */
    deploy:function(account,addressObj){
        var option = {
            cwd:__dirpath+"/components/project/deploy"
        };
        var cmd = "curl -u "+account.name+":"+account.pwd+" -Fjson=\"{'parameter':{'name':'JSStagingSer','value':'"+addressObj.ip+"'},'parameter':{'name':'JSStagingPort','value':'8080'},'parameter':{'name':'SVN','value':'"+addressObj.svn+"'},'token':'iqiyi_pps'}\" -FSubmit=Build \""+addressObj.target+"\"";
        exec(cmd,option,function(err,stdout,stderr){
            console.log("deploy success");
        });
    },
    /**
     *  查看部署状态
     * @param account 用户账号和密码
     * @param target 部署目标地址
     */
    checkDeploy:function(account,target){
        var option = {
            cwd:__dirpath+"/components/project/deploy"
        };
        var cmd = "curl -u "+account.name+":"+account.pwd+"\""+target+"\"";
        exec(cmd,option,function(err,stdout,stderr){
            console.log("check success");
        });
    }
};
