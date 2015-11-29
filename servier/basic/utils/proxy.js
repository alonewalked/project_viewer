var os = require("os");
var pf = os.platform().toLocaleLowerCase().indexOf("darwin") >= 0 ? "mac" : "windows";
var exec = require('child_process').exec;
var baseReg = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings";

module.exports = {
    support: function(){
        this.isSupport = (pf==='window');
        return this.isSupport;
    },
    /* 设置代理
     * @param {String} path  (1.1.1.1:8080)
     * @param {Function} callback(data) 
    */
    setProxy: function(path){
        var enable = !!path; 
        if (enable) {
            exec('reg add \"' + baseReg + '\" /v ProxyEnable /t REG_DWORD /d 00000001 /f', function (error, stdout, stderr) {
                if (!error) {
                    console.error("error:"+error);
                }
            });
            exec('reg add \"' + baseReg + '\" /v ProxyServer /d \"' + path + '\" /f',function (error, stdout, stderr) {
                if (!error) {
                    console.error("error:"+error);
                }
            });
        }
        else{
            this.closeProxy();
        }
        this.updateSystem();
    },
    closeProxy: function(){
        exec('reg add \"' + baseReg + '\" /v ProxyEnable /t REG_DWORD /d 00000000 /f',
        function (error, stdout, stderr) {
            if (!error) {
                console.error("error:"+error);
            }
        });
    },
    updateSystem: function(){
        exec('RunDll32.exe USER32.DLL,UpdatePerUserSystemParameters',
        function (error, stdout, stderr) {
            if (!error) {
                console.error("error:"+error);
            }
        });
    }
};