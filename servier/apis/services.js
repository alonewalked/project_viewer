// api for get css list
var url = require('url');
var path = require('path');
var basic = require('../basic/index');
var instance = require('../basic/instance');
var config = require('./config.json') ,sconf,pconf;
var pemconfig = require('./pemconfig.json').pem;
var ekit = require('./encrypt');

var data;
var Service = function (setting) {
    setting = setting || {};
    this._init(setting);
};
Service.prototype = {
	_init: function(){
		this.fn = null;
	},
	build: function(){
        var pwd = instance.getCurrentUserName(); 
        //ekit.encrypt(pwd,JSON.stringify(config),path.join(__dirname, pemconfig.path),path.join(__dirname, pemconfig.savepath));
        
        var strconfig = ekit.decipher(pwd,path.join(__dirname, pemconfig.path),path.join(__dirname, pemconfig.savepath));
        
        config = JSON.parse(strconfig);
        sconf = config.svn;
        pconf = config.project;
	},
    login: function(user,fn){
        var me = this;
        basic.users.login(user,function(data){
            me.build();
            fn(data);
        });

    },
    //////////////create//////////////
    createProject:function(doc,fn){
        basic.projects.create(doc,fn);
    },
    createBranch:function(doc,fn){
        //svn -> crate -> checkout
        var _pid = doc.projectids;
        var _name = doc.name;
        var _idx = doc['projectcategory'];
        var _pconf = pconf[_idx];
        var _conf = {};
        doc.projectids = [_pid]; 
        _conf.username = sconf.username;
        _conf.password = sconf.password;
        _conf.trunk = _pconf.trunk;
        _conf.branch = _pconf.branch+'/'+doc.name
        var _currbranch;
        var _create_fn = function(branch){
            console.log(doc);
            doc.svnpath = _currbranch;
            return basic.branchs.create(doc);
        };
        var _check_fn = function(branch){
            _currbranch = branch;
            var _cconf = {
                branch:_currbranch,
                username:sconf.username,
                password:sconf.password,
                target: path.join(_pconf.workspace,_name,_pconf.dirname)
            }; 
            return basic.svn.checkout(_cconf);
        }; 
        basic.svn.create(_conf).then(_check_fn,fn).then(_create_fn,fn).then(fn,fn);  
    },
    //////////////get//////////////
	getData:function(fn){ 
        basic.projects.getByQuery({},{
            ref:['ownerid']
        },function(data){
            fn(data);
        });
	},
    getServerConf: function(fn){
        var conf = instance.getServerConfig();
        fn({
            code:'A00000',
            data:conf
        })
    }
};
var _server = new Service();
module.exports = {
    createProject: function(req, res){  // post
        var params = req.body || {};
        console.log(params); 
        _server.createProject(params, function(data){
            console.log(data)
            return res.send(data);  
		});
    },
    createBranch: function(req, res){  // post
        var params = req.body || {}; 
        _server.createBranch(params, function(data){
            console.log(data)
            return res.send(data);  
		});
    },
	getData:function(req, res){
		_server.getData(function(data){
            if(req.query && req.query.callback){
                res.send(req.query.callback + '('+ JSON.stringify(data) + ');'); 
            }
            else{
                return res.json(data);  
            } 
		});
	},
    getServerConf: function(req, res){
        _server.getServerConf(function(data){
            console.log(data);
            if(req.query && req.query.callback){
                res.send(req.query.callback + '('+ JSON.stringify(data) + ');'); 
            }
            else{
                return res.json(data);  
            } 
		});
    },
    login: function(req, res){
        var params = req.query;
        _server.login({
            name:params['name'],
            email:params['email'],
            password:params['password']
        },function(data){
            console.log(data);
            if(params && params.callback){
                res.send(params.callback + '('+ JSON.stringify(data) + ');'); 
            }
            else{
                return res.json(data);  
            } 
		});
    }
};

