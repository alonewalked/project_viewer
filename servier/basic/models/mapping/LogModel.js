//log model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
    type:{ type:Number },    
    userid:{ type:ObjectId, ref:'User' },
    targetid:{ type:Number },  
    detail:{ type:String},
    time:{ type:Date, default:Date.now }
});
/*
type字段取值含义：
0：info
1: warning
2: error
targetid字段取值含义：
0：分支日志，
1：接口日志
2：项目日志
*/
mongoose.model('Log', schema);
