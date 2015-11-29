// dao base
var errorHandler = require('./errorHandler');
var $q = require('q');
function DaoBase (Model){ 
    this.model = Model;
}

//create
DaoBase.prototype.create = function (doc,callback){
    var deferred = $q.defer();
    this.model.create(doc, function (error,newdoc) {
        if(error){
            deferred.reject(errorHandler.handle(error));
        }
        else{
            deferred.resolve({
                "code":'A00000',
                "data":newdoc
            });
        }
    });
    return deferred.promise.nodeify(callback); 
};

DaoBase.prototype.getById = function (id, callback) {
    var deferred = $q.defer();
    this.model.findById(id, function(error, doc){
        if(error){
            deferred.reject(errorHandler.handle(error));
        }
        else{
            deferred.resolve({
                "code":'A00000',
                "data":doc
            });
        } 
    });
    return deferred.promise.nodeify(callback);  
}; 

DaoBase.prototype.getOne = function(query, options, callback){
    var deferred = $q.defer();
    var _opt = arguments[1];
    var hasoptions = (typeof _opt==='object'); 
    var _fn,finder;
    if(!hasoptions){
        _fn = arguments[1];
        this.model.findOne(query, function(error, doc){ 
            if(error){
                deferred.reject(errorHandler.handle(error)); 
            }
            else{
                deferred.resolve({
                    "code":'A00000',
                    "data":doc
                });
            }
        });
    }
    else{
        _fn = arguments[2];
        finder = this.model.findOne(query);
        if(_opt.limit){
            finder = finder.limit(_opt['limit']);
        }
        if(_opt.sort){
            finder = finder.sort(_opt['sort']);
        }
        finder.exec(function(error,doc){
            if(error){
                deferred.reject(errorHandler.handle(error)); 
            }
            else{
                deferred.resolve({
                    "code":'A00000',
                    "data":doc
                });
            }
        });
    }
    return deferred.promise.nodeify(_fn); 
};
DaoBase.prototype.countByQuery = function (query, callback) {
    this.model.count(query, function(error, doc){ 
        if(error){
            return callback(errorHandler.handle(error));
        }
        return callback({
            "code":'A00000',
            "data":doc
        });
    });
};
 
DaoBase.prototype.getByQuery = function (query, callback) {
    var deferred = $q.defer();
    this.model.find(query, function(error,doc){
        if(error){
            deferred.reject(errorHandler.handle(error));
        }
        else{
            deferred.resolve({
                "code":'A00000',
                "data":doc
            });
        }
    });
    return deferred.promise.nodeify(callback);  
};

DaoBase.prototype.getByMutilQuery = function (query,options,callback) {
    if(!options){
        return this.getByQuery(query,callback);
    }
    var deferred = $q.defer();
    var finder,counter;
    finder = this.model.find(query);
    // pager
    var _start,_size,_totalpage,_total;
    // do exec
    function doExec(){
        if(options.ref && options.ref.length){    // 外键关联
            finder.populate('created_by ' + [options.ref.join(' ')]);
        }
        finder.exec(function(error,doc){
            if(error){
                deferred.reject(errorHandler.handle(error)); 
            }
            else{
                var result = {
                    "code":'A00000',
                    "data":doc
                };
                if(_size){
                    result.no = _start;
                    result.total = _total;
                    result.totalPage = _totalpage;
                }
                deferred.resolve(result);
            }
        });    
    } 
    if(options.limit){
        finder = finder.limit(options['limit']);
    }
    if(options.sort){
        finder = finder.sort(options['sort']);
    }
    _start = options['no'] || 1;
    _size = options['no']?(options['pagesize']||10):0;
    if(_size){ 
        finder.exec(function(err,docs){
            _total = docs.length;
            _totalpage = _total%_size===0?_total/_size:(parseInt(_total/_size,10)+1);
            finder = finder.skip((_start-1)*_size).limit(_size); 
            doExec();
        }); 
    }
    else{
        doExec();
    }
    return deferred.promise.nodeify(callback);
};

DaoBase.prototype.getAll = function (callback) {
    var deferred = $q.defer();
    this.model.find({}, function(error,doc){ 
        if(error){
            deferred.reject(errorHandler.handle(error));
        }
        else{
            deferred.resolve({
                "code":'A00000',
                "data":doc
            });
        }
    });
    return deferred.promise.nodeify(callback);
};

DaoBase.prototype.delete = function (query, callback){
    var deferred = $q.defer();
    this.model.remove(query, function(error){ 
        if(error){
            deferred.reject(errorHandler.handle(error));
        }
        else{
            deferred.resolve({
                "code":'A00000',
                "data":doc
            });
        }
    });
    return deferred.promise.nodeify(callback);
};

DaoBase.prototype.update = function(conditions, update, callback) {
    var deferred = $q.defer(); 
    this.model.update(conditions, update, function (error,doc) {
        if(error){
            deferred.reject(errorHandler.handle(error));
        }
        deferred.resolve({
            "code":'A00000',
            "data":doc
        });
    });
    return deferred.promise.nodeify(callback);
};

DaoBase.prototype.findAndUpdate = function(conditions, update, callback) {
    var deferred = $q.defer();
    var _def = this.update(conditions, update, callback);
    var _def2 = this.getByQuery(conditions,callback);
    $q.all([_def, _def2])
    .spread(function (r1,r2) {  //对应的多个返回值
        if(r2){
            deferred.resolve(r2);
        }
    })
    .fail(function(error) {
        deferred.reject(errorHandler.handle(error));
    });
    return deferred.promise.nodeify(callback);
};
module.exports = DaoBase;