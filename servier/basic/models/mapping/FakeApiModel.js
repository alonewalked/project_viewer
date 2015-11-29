//fake api model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
    alias:{ type:String },  // 接口别名
    hostname:{ type:String },   // 域名
    ownerid:{ type:ObjectId, ref:'User' },  // 创建接口userid
    path:{ type:String},   // 接口路径     
    apiname:{ type:String},  // 接口名
    params:{ type:String},
    method:{ type:String, default:'GET'},
    data:{ type:String } // 接口返回值json string
});

mongoose.model('FakeApi', schema);
