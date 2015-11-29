/*instance
  global functions
*/ 
var currentUser,currentPassword,serverConf,logged;

module.exports = {
    setServerconfig: function(config){
        serverConf = config;
    },
    getServerConfig: function(key){
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
    }
};