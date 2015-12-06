var $q = require('q');
var mongoTool = require('./utils/mongotool');
var branchs = require('./apis/branchs'),
    projects = require('./apis/projects'),
    fakeapis = require('./apis/fakeapis'),
    users = require('./apis/users'),
    serverconfig = require('./apis/serverconfig');
var instance = require('./instance');  
var start = function(cmd,callback){
    switch(cmd){
    case 'login':   //√
        users.login({
            name:'tj3',
            password:'1111111',
            email:'tj3@tj.com'
        },function(data){
            callback(data);
        });
        break;
    case 'user':   //√
        users.getByName('test1',function(data){
            callback(data); 
        });
        break;
    case 'user_setting':   //√
        var _b = instance.getWorkspaceRoot();
        users.updateSetting('',{workspaceroot:'\\test\\'+Date.now()},function(data){
            callback(data); 
            console.log('before: '+_b+'\r\n after: '+instance.getWorkspaceRoot())
        });
        break;
    case 'user_curr_project':   //√
        var _set_fn = function(d1){
            if(d1.data){
                users.setCurrentProject('',d1.data._id.toString(),callback)
            }
        };
        projects.getLastProject().then(_set_fn,callback);
        break;
    case 'pro':  //√
        projects.getByQuery({},{
            limit:3,
            sort:'-launchdate'
        },function(data){
            callback(data); 
        });
        break;
    case 'pro_pager':  //√
        projects.getByQuery({},{
            sort:'-launchdate',
            no:1,
            pagesize:10,
            ref:['ownerid']
        },function(data){
            callback(data); 
        });
        break;
    case 'api+pro':   //√ 
        var _fid,_pid;
        var _def = fakeapis.create({
            alias:'test_1'+(Date.now()),
            apiname:'test',
            hostname:'www.iqiyi.com',
            path:'ife'
        });
        var _def2 = projects.getLastProject(); 
        $q.all([_def, _def2])
        .spread(function (r1,r2) {  //对应的多个返回值
            if(r1&&r2){
                _fid = r1.data&&r1.data._id.toString();
                _pid = r2.data&&r2.data._id.toString();
                projects.addTestApi(_pid,_fid,callback);
            }
        })
        .fail(function(data) {
            callback(data);
        });
        break;
    case 'api_del':   //√ 
        var _find_fn = function(d1){
            var ids = [];
            if(d1.data){
                d1.data.forEach(function(item){
                    ids.push(item._id);
                });
                return fakeapis.delete(ids);
            }
        };
        fakeapis.suggest('test')
        .then(_find_fn,callback)
        .then(callback,callback);
        break;
    case 'user_new':   //√
        users.create({"name":'test1'},function(data){
            callback(data); 
        });
        break;
    case 'user_id':
        users.getByQuery({_id:'5647158815dd72ec36d9bea9'},null,function(data){
            callback(data);  
        });
        break;
    case 'user_upd':
        users.update({"name":"test1"},{'name':'test2'},function(data){
            callback(data); 
        });
        break;
    case 'pro_new':   // √
        var i = 0,list=[];
        var _docreate, _created_fn,
        _docreate = function(i){ 
            if(i>10){
                return;
            }
            projects.create({"name":new Date().getTime()+"_testprj1_"+i})
            .then(_created_fn,callback);
        }; 
        _created_fn = function(d1){
            if(d1.code!=="A00000"){
                return;
            }
            list.push(d1.data._id.toString());
            if(i===10){ 
                branchs.create({"name":new Date().getTime()+"testbranch_prj",projectids:list},function(d){
                    callback(d);
                }); 
            } 
            _docreate(++i);
        }
        _docreate(++i);
        break;
    case 'proaddpage':  // √
        var _getlast_fn = function(data){
            if(data.code !== 'A00000'){
                return callback(data);
            }
            if(data.data){
                projects.addTestPage(data.data._id.toString(), 'http://www.test.com/'+(Date.now()),function(d){
                    callback(d); 
                });
            }
        };
        projects.getLastProject().then(_getlast_fn,callback); 
        break;
    case 'pro_upd_endtime': 
        projects.getLastProject(function(data){
            if(data.code !== 'A00000'){
                return callback(data);
            }
            if(data.data){
                projects.update(data.data._id.toString(), {'endtime':new Date()},function(d){
                    callback(d); 
                });
            }
        }); 
        break;
    case 'pro_upd_state': 
        var _upd_fn = function(d1){
            if(d1.data){
                projects.setProjectStatus(d1.data._id.toString(),5)
                .then(callback,callback);
            }
        };
        projects.getLastProject().then(_upd_fn,callback); 
        break;
    case 'branch_new': 
        var _def = branchs.create({"name":"testbranch_"+(Date.now())});
        var _def2 = projects.getLastProject();
        $q.all([_def, _def2])
        .spread(function (r1,r2) {  //对应的多个返回值
            if(r1&&r2){
                _bid = r1.data&&r1.data._id.toString();
                _pid = r2.data&&r2.data._id.toString();
                branchs.setRelativeProject(_bid,_pid,callback);
            }
        })
        .fail(function(data) {
            callback(data);
        });
        break;
    case 'branch_find': // √
        branchs.getByQuery({},{
            deepref:{'projectids':['apialiasid','ownerid']}
        },
        function(data){
            callback(data);
        });
        break;
    case 'branch_deepfind': // √
        var _get_fn = function(d){
            if(d.data){
                branchs.getProjectsByBranch(d.data._id.toString(),['apialiasid','ownerid'],callback);
            }
        };
        branchs.getLastBranch().then(_get_fn,callback);
        break;
    case 'branch_pro': // √
        var _getlast_fn = function(d){
            if(d.data){
                branchs.getProjectsByBranch(d.data._id.toString(),function(data){ 
                    callback(data); 
                });
            }
        };
        branchs.getLastBranch().then(_getlast_fn,callback); 
        break;
    case 'branch_del':
        var _del_fn = function(d1){
            if(d1.data){
                branchs.delete(d1.data._id.toString(),function(data){
                    callback(data);
                });
            }
            
        }
        branchs.getLastBranch().then(_del_fn,callback);
        break;
    case 'server_init': // √
        var conf = instance.getServerConfig();
        if(conf){
            return callback({
                code:'A00000',
                data:conf
            })
        }
        else{
            serverconfig.getServerConfig(callback);
        }
        break;     
    case 'backup':
        mongoTool.backup();
        break; 
    case 'recover':
        mongoTool.recover();
        break;
    }  
};

module.exports = start;