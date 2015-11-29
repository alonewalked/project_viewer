// store.js
import Firebase from 'firebase';
import { EventEmitter } from 'events';
import { Promise } from 'es6-promise'; 

const api = new Firebase('https://sweltering-fire-8263.firebaseio.com/app');
const config = {
    projects: 'http://localhost:1212/api/get_data'
};
let loginUser = null;
const store = new EventEmitter();
let ids = [];
let storeData  = {};

// create user
api.child('users').on('value', data => {
  ids = data.val()
  store.emit('users-updated')
})

// login
store.login = (uname,pwd) => {
    return new Promise((resolve, reject) => {
    api.child('users/' + uname)
    .once('value', data => {
        if(pwd === data.val()){
            loginUser = { username:uname, password:pwd };
            resolve(loginUser);
        }
        else{
            reject('password error');
        }
    }, reject);
  })
}; 
store.getLoginUser = function(){
    loginUser = loginUser || {};
    return loginUser;
};
store.getProject = function (callback) {
     if(storeData['projects']){
        return callback(storeData['projects']);
     }
     $.ajax({
        url: config.projects,
        dataType: 'jsonp',
        success: function(d){
            if(d.code==='A00000'){
                storeData['projects'] = d.data;
                return callback(storeData['projects']);
            }
            else{
                return callback({});
            }
        }
     });
};
export default store