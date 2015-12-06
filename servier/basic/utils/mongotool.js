var exec = require('child_process').exec;
var os = require('os');
var backuplist = require('./config.json').backuplist;
module.exports = {
    backup: function(callback){
        var result = true;
        backuplist.forEach(function(item,idx){ 
            var cmd = 'mongoexport -h 10.1.30.43 -d ife -c ' + item + ' -o E:ife_'+ item +'.dat'; 
            exec(cmd,function(err,stdout,stderr){
                if (stderr) {
                    result = false;
                    console.log(stderr);
                }
                else{
                    console.log(stdout)
                }
                if(idx === backuplist.length-1){
                    callback({
                        code: result?'A00000':'E00001',
                        message: result?'backup done':'backup error'
                    })
                }
            });
        });
    },
    recover: function(callback){
        backuplist.forEach(function(item){  
            var cmd = 'mongoimport -h 10.1.30.43 -d test -c ' + item + ' E:ife_'+ item +'.dat'; 
            console.log(cmd)
            exec(cmd,function(err,stdout,stderr){
                if (stderr) {
                    result = false;
                    console.log(stderr);
                }
                else{
                    console.log(stdout)
                }
                if(idx === backuplist.length-1){
                    callback({
                        code: result?'A00000':'E00001',
                        message: result?'recover done':'recover error'
                    })
                }
            });
        });
    }
}