// api for get css list
var url = require('url');
var basic = require('../basic/index'); 
var data;
var Service = function (setting) {
    setting = setting || {};
    this._init(setting);
};
Service.prototype = {
	_init: function(){
		this.fn = null;
		this.build();
	},
	build: function(){ 
		 
	},
	getData:function(fn){ 
		 basic.projects.getByQuery({},{},function(data){
            fn(data.data);
         });
	}
};
var _server = new Service();
module.exports = {
	getData:function(req, res){
		_server.getData(function(d){
            console.log(data);
            if(req.query && req.query.callback){
                res.send(req.query.callback + '('+ JSON.stringify({code:'A00000',data:d}) + ');'); 
            }
            else{
                return res.json({code:'A00000',data:d});  
            } 
		});
	}
};

