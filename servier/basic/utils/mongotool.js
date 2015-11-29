var exec = require('child_process').exec;
var os = require('os');
var backuplist = require('./config.json').backuplist;
module.exports = {
    backup: function(callback){
        backuplist.forEach(function(item){ 
            var cmd = 'mongoexport -h 10.1.30.43 -d ife -c ' + item + ' -o E:ife_'+ item +'.dat'; 
            exec(cmd,function(err,stdout,stderr){
                if (stderr) {
                    console.log(stderr);
                }
                else{
                    console.log(stdout)
                }
            });
        });
    },
    recover: function(){
        backuplist.forEach(function(item){  
            var cmd = 'mongoimport -h 10.1.30.43 -d tj -c ' + item + ' E:ife_'+ item +'.dat'; 
            console.log(cmd)
            exec(cmd,function(err,stdout,stderr){
                if (stderr) {
                    console.log(stderr);
                }
                else{
                    console.log(stdout)
                }
            });
        });
    }
}