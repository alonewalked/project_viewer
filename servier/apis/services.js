// api for get css list
var url = require('url');
var path = require('path');
var os = require('os');
var basic = require('../basic/index');
var instance = require('../basic/instance');
var config = require('./config.json') ,sconf,pconf,wconf,rconf,svconf;
var pemconfig = require('./pemconfig.json').pem;
var ekit = require('./encrypt');

var serverconfig = require('../basic/apis/serverconfig');

var ismac = /darwin/.test(os.platform());

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
        // encrypt.
        ekit.encrypt(pwd,JSON.stringify(config),path.join(__dirname, pemconfig.path),path.join(__dirname, pemconfig.savepath));

        var strconfig = ekit.decipher(pwd,path.join(__dirname, pemconfig.path),path.join(__dirname, pemconfig.savepath),path.join(__dirname, pemconfig.configpath));

        config = JSON.parse(strconfig);
        sconf = config.svn;
        pconf = config.project;
        wconf = config.email;
        svconf = config.serverconf;
        rconf = ismac?config.macroot:config.root;
	},
    login: function(user,fn){
        var me = this;
        var do_getserver = function(){
            serverconfig.getServerConfig(svconf, function(d3){
                if(d3.code === 'A00000'){
                    instance.setServerconfig(d3.data);
                }
            });
        }
        basic.users.login(user,function(data){
            me.build();
            do_getserver();
            fn(data);
        });

    },
    //////////////create//////////////
    createProject:function(doc,fn){
        basic.projects.create(doc).then(fn,fn);
    },
    createBranch:function(doc,type,fn){
        type = type || 1;
        //1: all,2:create db+svn,3:checkout,4:create db
        //crate -> project+bid -> svn -> checkout
        var _pid = doc.projectids;
        var _name = doc.name;
        var _idx = doc['projectcategory'];
        var _pj = pconf[_idx];
        var _conf = {};
        doc.projectids = _pid.split(',');
        _conf.username = sconf.username;
        _conf.password = sconf.password;
        _conf.trunk = _pj.trunk;
        var _currbranch = _conf.branch = _pj.branch+'/'+doc.name;
        var _create_fn = function(b1){
            console.log(doc);
            if(!doc.svnpath){
                doc.svnpath = _currbranch;
            }
            return basic.branchs.create(doc);
        };
        var _upd_fn = function(d1){
            if(!d1.data){
                throw d1;
            }
            return basic.projects.update({
                _id:_pid
            },{
                branchid: d1.data._id.toString()
            });
        };
        var _newsvn_fn = function(){
            return basic.svn.create(_conf);
        };
        var _check_fn = function(branch){
            var _cconf = {
                branch:_currbranch,
                username:sconf.username,
                password:sconf.password,
                target: path.join(rconf,_pj.workspace,_name,_pj.dirname)
            };
            return basic.svn.checkout(_cconf);
        };
        var handler;
        switch(type){
        case '1':
            handler = _newsvn_fn()
            .then(_check_fn,fn)
            .then(_create_fn,fn)
            .then(_upd_fn,fn);
            break;
        case '2':
            handler = _newsvn_fn()
            .then(_create_fn,fn)
            .then(_upd_fn,fn);
            break;
        case '3':
            handler =  _check_fn(doc.svnpath);
            break;
        case '4':
            _currbranch = doc.svnpath;
            handler = _check_fn(doc.svnpath)
            .then(_create_fn,fn)
            .then(_upd_fn,fn);
        }
        handler.then(fn,fn);
    },
    //////////////update///////////
    updProject:function(id,doc,fn){
        basic.projects.update(id,doc).then(fn,fn);
    },
    //////////////get//////////////
	getData:function(fn){
        basic.projects.getByQuery({},{
            ref:['ownerid','branchid']
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
    },
    sendWeekly: function(content, fn){
        var _send_fn = function(d){
            if(d && d.data.path){
                return basic.email.send({
                    path:d.data.path,
                    email:wconf
                });
            }
            else{
                throw 'ppt error';
            }
        };
        basic.ppt.generate(content)
        .then(_send_fn,fn)
        .then(fn,fn);
    },
    openFolder: function(options, fn) {
        options = options || {};
        var _type = options.type?options.type:'qiyiStore';
        var _folder = options.folder;
        var _pj = pconf.filter(function(item){
            return item.dirname === _type;
        });
        _pj = _pj[0];
        var params = {};
        if(ismac){
            params.ismac = true;
            params.path = path.join(rconf,_pj.workspace,_folder);
        }
        else{
            params.ismac = false;
            params.disk = rconf.substring(0,2);
            params.path = path.join(rconf,_pj.workspace,_folder);
        }
        basic.sysfile.openfolder(params).then(fn,fn);
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
    updProject: function(req, res){  // post
        var params = req.body || {};
        var id = params.id || '',
        doc = params.doc || '';
        doc = JSON.parse(doc);
        if(!id){
            return res.send({
                code:'C00002',
                message:'id empty'
            }); 
        }
        _server.updProject(id, doc,function(data){
            console.log(data)
            return res.send(data);  
        });
    },
    createBranch: function(req, res){  // post
        var params = req.body || {}; 
        var _type = params['type'] = params['type'] || 1; 
        delete params['type'];
        _server.createBranch(params,_type,function(data){
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
            if(params && params.callback){
                res.send(params.callback + '('+ JSON.stringify(data) + ');'); 
            }
            else{
                return res.json(data);  
            } 
		});
    },
    sendWeekly: function(req, res){
        var params = req.body || {};
        _server.sendWeekly(params.content,function(data){
            console.log(data)
            return res.send(data);  
        });
    },
    openFolder: function(req, res){
        var params = req.query;
        _server.openFolder({
            type: params.type,
            folder: params.folder
        },function(data){
            if(params && params.callback){
                res.send(params.callback + '('+ JSON.stringify(data) + ');'); 
            }
            else{
                return res.json(data);  
            } 
        });
    }
};

