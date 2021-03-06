// store.js
import Firebase from 'firebase';
import { EventEmitter } from 'events';
import { Promise } from 'es6-promise'; 

const api = new Firebase('https://sweltering-fire-8263.firebaseio.com/app');
const base_path = 'http://localhost:1212/';
const config = {
    login: base_path+'api/login',
    new_project: base_path+'api/create_project',
    new_branch: base_path+'api/create_branch',
    upd_project: base_path+'api/upd_project',
    projects: base_path+'api/get_data',
    serverconf: base_path+'api/get_serverconf',
    weekly: base_path+'api/send_weekly',
    open_folder: base_path+'api/open_folder'
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
    //api.child('users/' + uname)
    //.once('value', data => {
    //    if(pwd === data.val()){
            $.ajax({
                url:config['login'],
                data:{
                    name:uname,
                    password:pwd,
                    email:uname+'@123.com'
                },
                dataType:'jsonp',
                success:function(d){
                    loginUser = d.data;
                    resolve(loginUser);
                },
                error: function(err){
                    reject(err)
                }
            });
        //}
        //else{
        //    reject('password error');
        //}
    //}, reject);
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
                //storeData['projects'] = d;
                return callback(d);
            }
            else{
                return callback({});
            }
        }
     });
};
store.getServerConf = function(callback){
     if(storeData['serverconfig']){
        return callback(storeData['projects']);
     }
     $.ajax({
        url: config.serverconf,
        dataType: 'jsonp',
        success: function(d){
            if(d.code==='A00000'){
                storeData['serverconfig'] = d;
                return callback(storeData['serverconfig']);
            }
            else{
                return callback({});
            }
        }
     });
};
store.createProject = function(doc, callback){
    return new Promise((resolve, reject) =>{
        $.ajax({
            type: "POST",
            url: config.new_project,
            data: doc,
            success: function(d){
                if(d.code==='A00000'){
                    resolve(d);
                }
                else{
                    reject(d);
                }
            }
         });
     });
};
store.updateProject = function(params, callback){
    return new Promise((resolve, reject) =>{
        $.ajax({
            type: "POST",
            url: config.upd_project,
            data: params,
            success: function(d){
                if(d.code==='A00000'){
                    resolve(d);
                }
                else{
                    reject(d);
                }
            }
         });
     });
};
store.createBranch = function(doc, callback){
    return new Promise((resolve, reject) =>{
        $.ajax({
            type: "POST",
            url: config.new_branch,
            data: doc,
            success: function(d){
                if(d.code==='A00000'){
                    resolve(d);
                }
                else{
                    reject(d);
                }
            }
         });
     });
};
store.sendWeekly = function(html, callback){
    return new Promise((resolve, reject) =>{
        $.ajax({
            type: "POST",
            url: config.weekly,
            data: {content:html},
            success: function(d){
                if(d.code==='A00000'){
                    resolve(d);
                }
                else{
                    reject(d);
                }
            }
         });
     });
};
store.openFolder = function(item, callback){
    return new Promise((resolve, reject) =>{
        $.ajax({
            dataType: 'jsonp',
            url: config.open_folder,
            data: {
                "folder":'test1'
            },
            success: function(d){
                if(d.code==='A00000'){
                    resolve(d);
                }
                else{
                    reject(d);
                }
            }
         });
     });
}
export default store;