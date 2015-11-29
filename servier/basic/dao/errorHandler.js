var type = {
    'required':'B00001',
    '11000':'B00002',
    'CastError':'B00003',
    'userdefined':'C00001'
    
}
module.exports = {
    getErrorType: function(){
        return type;
    },
    handle: function(err){
        var result = {};
        var _err = err.errors;
        var _type,_kind;
        if(_err){
            _err.name = _err.name ||
                    (function(_e){
                        var _keys = Object.keys(_e);
                        return _keys[0]?_e[_keys[0]]:{};
                    })(_err);
            _kind = _err.name.kind || '';
            _kind = _kind.replace(/\s/ig,'');
            _type = type[_kind];
            _type = _type || 'E00001';
            result['code'] = _type;
            result['message'] = _err.name.message;
        }
        else if(err.code == 11000){
            _type = type[err.code]; 
            result['code'] = _type;
            result['message'] = err.message;
        }
        else if(err.name === 'CastError'){
            _type = type[err.name]; 
            result['code'] = _type;
            result['message'] = err.message;
        }
        else{
            result['code'] = 'E00001';
            result['mssage'] = 'unkonwn error';
        }
        return result;
    }
};