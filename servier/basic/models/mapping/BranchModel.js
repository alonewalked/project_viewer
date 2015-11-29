// branch model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
    projectids:[{
        type: ObjectId,
        ref: 'Project'
    }],
    name:{ type:String, required: true, unique: true },
    createBy: { type:ObjectId, ref: 'User'},
    createtime: {type:Date, default:Date.now},
    projectcategory:{ type:[Number] },
    tag:{type:String},
    svnpath:{ type:String},
    testserverip:{ type:String},
    deployaccount:{ type:String }
});

schema.path('name').validate(function(value, done) {
    this.model('Branch').count({ name: value }, function(err, count) {
        if (err) {
            return done(err);
        } 
        done(!count);
    });
}, 'branch name already exists');

mongoose.model('Branch', schema);

/*
projectcategory字段取值含义：
0：qiyiV2
1：qiyi
2：lib
3：pingback
*/