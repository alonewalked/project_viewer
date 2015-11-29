// change host
var os = require("os");
var pf = os.platform().toLocaleLowerCase().indexOf("darwin") >= 0 ? "mac" : "windows";
var exec = require('child_process').exec;
var _hpath = pf==="windows"?'/Windows/System32/Drivers/etc/hosts':'/private/etc/hosts';
module.exports = {
    getHostPath: function(){
        return _hpath;
    }
}