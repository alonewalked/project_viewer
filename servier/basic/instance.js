/*instance
  global functions
*/ 
var currentUser,currentPassword,serverConf,logged;

module.exports = {
    setServerconfig: function(config){
        if(config.projectsvn){
            config.projectsvn = JSON.parse(config.projectsvn);
        }
        if(config.projectstatus){
            config.projectstatus = JSON.parse(config.projectstatus);
        }
        serverConf = config;
    },
    getServerConfig: function(key){
        if(!serverConf){
            return null;
        }
        if(key){
            return serverConf[key];
        }
        return serverConf;
    },
    setCurrentUser: function(user,pwd){
        currentUser = user;
        currentPassword = pwd;
        logged = true;
    },
    updCurrentUser: function(user){
        currentUser = user;
    },
    getCurrentUser: function(){
        return currentUser;
    },
    getCurrentUserName: function(){
        return currentUser?currentUser.name:'';
    },
    getCurrentUserid: function(){
        return currentUser?currentUser._id.toString():'';
    },
    getPassword: function(){
        return currentPassword;
    },
    isLoggedin: function(){
        return !!currentUser && !!logged;
    },
    getUserSetting: function(){
        if(!currentUser){
            return null;
        }
        return currentUser.psetting;
    },
    getWorkspaceRoot: function(){
        var setting = this.getUserSetting();
        return setting?setting['workspaceroot']:'';
    }
};