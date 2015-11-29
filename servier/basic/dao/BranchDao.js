// branch dao
var $q = require('q');
var DaoBase = require('./DaoBase'),
    model = require('../models').Branch;
    var _model = new DaoBase(model);
    _model.findPopulate = function(id,popkey,callback){
        var deferred = $q.defer();
        model
        .findById(id)
        .populate('created_by ' + popkey)
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