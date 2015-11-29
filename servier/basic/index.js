var DB = require('./models/index').DB;
var app = {
    start:function(dbpath,callback){
        if(this.status === 1){
            return callback({
                code:'A00001',
                message:'had been connected'
            })
        }
        var me = this;
        this.db = new DB(dbpath);
        this.db.connected.on('error', function(err){
            me.status = -1;
            if(callback){
                callback({
                    code:'A00002',
                    message:err.message
                });
            }
        });
        this.db.connected.once('open', function () {
            me.status = 1;
            if(callback){
                callback({
                    code:'A00000',
                    message:'connect success'
                })
            }
        }); 
    },
    exit:function(){
        if(this.db && this.status === 1){
            this.db.connected.close();
        }
    }
};
/*
    启动
    @param {String} url 数据库连接地址，默认ife; e.g. mongodb://10.1.30.43:27017/tj
*/ 
app.start('',function(data){
    console.log(JSON.stringify(data)); 
});


exports['app'] = app;

exports['projects'] = require('./apis/projects');
exports['users'] = require('./apis/users');
exports['branchs'] = require('./apis/branchs');
exports['fakeapis'] = require('./apis/fakeapis');
exports['testUser'] = require('./apis/testUser');

// utils
require('./utils/date');
exports['svn'] = require('./utils/svn');