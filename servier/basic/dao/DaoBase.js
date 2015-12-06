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
    this.model.findById(id).lean().exec(function(error, doc){
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
        this.model.findOne(query).lean().exec(function(error, doc){ 
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
    this.model.find(query).lean().exec(function(error,doc){
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
    var me = this, 
    deferred = $q.defer(),
    finder,counter;
    finder = this.model.find(query).lean();
    // pager
    var _start,_size,_totalpage,_total;
    // do exec
    function doExec(){
        if(options.ref && options.ref.length){    // 外键关联
            finder.populate(options.ref.join(' '));
        }
        else if(options.deepref && me.findDeepPopulate){
            return me.findDeepPopulate(finder,options.deepref,callback).then(function(d){
                deferred.resolve(d);
            },function(d){
                deferred.reject(d);
            });
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
    this.model.find({}).lean().exec(function(error,doc){ 
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
    this.model.remove(query, function(error, doc){ 
        if(error){
            deferred.reject(errorHandler.handle(error));
        }
        else{
            deferred.resolve({
                "code":'A00000',
                "data":doc.result
            });
        }
    });
    return deferred.promise.nodeify(callback);
};

DaoBase.prototype.delByIds = function (ids, callback){
    var deferred = $q.defer();
    var _df1 = this.delete({_id: {$in: ids} },callback);
    var _df2 = this.getAll(callback);
    $q.all([_df1, _df2])
    .spread(function (r1,r2) {  //对应的多个返回值
        if(r1.data.n === 0){
            deferred.resolve({
                code:'C00002',
                message:'no item deleted'
            });
        }
        if(r1.data.n && r2){
            deferred.resolve(r2);
        }
    })
    .fail(function(error) {
        deferred.reject(error);
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
    var _query = (function(){
        for(var k in conditions){
            if(update[k]){
                return update;
            }
        }
        return conditions;
    })();
    var deferred = $q.defer();
    var _def = this.update(conditions, update, callback);
    var _def2 = this.getByQuery(_query,callback);
    $q.all([_def, _def2])
    .spread(function (r1,r2) {  //对应的多个返回值
        if(r1.data.n === 0){
            deferred.resolve({
                code:'C00002',
                message:'no item updated'
            });
        }
        if(r1.data.n && r2){
            deferred.resolve(r2);
        }
    })
    .fail(function(error) {
        deferred.reject(error);
    });
    return deferred.promise.nodeify(callback);
};
module.exports = DaoBase;