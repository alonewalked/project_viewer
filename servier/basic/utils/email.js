var emailjs   = require("emailjs");
var $q = require('q');
require('./date');

// send the message and get a callback with an error or details of the message that was sent


module.exports = {
    send: function(options,callback){
        var deferred = $q.defer();
        var email = options.email;
        var server  = emailjs.server.connect({
           user:email.user, 
           password:email.pwd, 
           host:"mail.iqiyi.com",
           port: 25
        });
        server.send({
           text:"this is send by node tool...", 
           from:email.from, 
           to:email.to,
           cc:email.cc,
           subject: "周报_"+new Date().Format('yyyyMMdd'),
           attachment: 
           [
              {path:options['path'], type:"application/pptx", name:options['path']}
           ]
        },function(err, message) { 
            if(err){
                deferred.reject({
                    code: 'A00001',
                    error:err
                });
            }
            else{
                deferred.resolve({
                    code: 'A00000',
                    msg: message
                });
            }
        });
        return deferred.promise.nodeify(callback); 
    } 
};