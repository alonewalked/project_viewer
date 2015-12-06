// branch dao
var $q = require('q');
var DaoBase = require('./DaoBase'),
    model = require('../models').Branch,
    deepModel = {
        "ownerid":require('../models').User,
        "apialiasid":require('../models').FakeApi
    }
    var _model = new DaoBase(model);
    _model.findPopulate = function(id,popkey,callback){
        var deep = typeof popkey === 'object',
            deferred = $q.defer(),
            subdef = [], topkey;
        if(!deep){
            topkey = popkey;
        }
        else{
            topkey = Object.keys(popkey)[0];
        }
        model
        .findById(id)
        .lean()
        .populate(topkey)
        .exec(function(error,docs){
            if(error){
                 deferred.reject(errorHandler.handle(error));
            }
            else{
                if(!deep){
                    deferred.resolve({
                        "code":'A00000',
                        "data":docs
                    });
                }
                else{
                    popkey[topkey].forEach(function(i){
                        subdef.push(deepModel[i].populate(docs,{
                            path: topkey+'.'+i
                        }));
                    });
                    $q.all(subdef).then(
                    function(alldoc){
                        deferred.resolve({
                            "code":'A00000',
                            "data":alldoc[0]
                        });
                    },function(err){
                        deferred.reject(errorHandler.handle(err));
                    });
                }
            }
        });
        return deferred.promise.nodeify(callback);
    };
    _model.findDeepPopulate = function(modelfind,popkey,callback){
        var deep = typeof popkey === 'object',
            deferred = $q.defer(),
            subdef = [], topkey;
        if(!deep){
            topkey = popkey;
        }
        else{
            topkey = Object.keys(popkey)[0];
        }
        modelfind
        .lean()
        .populate(topkey)
        .exec(function(error,docs){
            if(error){
                 deferred.reject(errorHandler.handle(error));
            }
            else{
                if(!deep){
                    deferred.resolve({
                        "code":'A00000',
                        "data":docs
                    });
                }
                else{
                    popkey[topkey].forEach(function(i){
                        subdef.push(deepModel[i].populate(docs,{
                            path: topkey+'.'+i
                        }));
                    });
                    $q.all(subdef).then(
                    function(alldoc){
                        deferred.resolve({
                            "code":'A00000',
                            "data":alldoc[0]
                        });
                    },function(err){
                        deferred.reject(errorHandler.handle(err));
                    });
                }
            }
        });
        return deferred.promise.nodeify(callback);
    };
module.exports = _model;