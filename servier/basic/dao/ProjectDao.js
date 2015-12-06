// project dao
var $q = require('q');
var errorHandler = require('./errorHandler');
var DaoBase = require('./DaoBase'),
    model = require('../models').Project,
    _model = new DaoBase(model);
    _model.findPopulate = function(id,popkey,callback){
        var deferred = $q.defer();
        model
        .findById(id)
        .populate(popkey)
        .lean()
        .exec(function(error,docs){
            if(error){
                deferred.reject(errorHandler.handle(error));
            }
            else{
                deferred.resolve({
                    "code":'A00000',
                    "data":docs
                });
            }
        });
        return deferred.promise.nodeify(callback);
    };
module.exports = _model;