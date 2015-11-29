// user model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    ObjectId = Schema.ObjectId; 

var schema = new Schema({
    employid:Number,
    name:{type:String, required: true, unique: true},
    email:String,
    psetting:{
        "projectfilter" : Number,
        "idepath" : String
    }
});
schema.path('name').validate(function(value, done) {
    this.model('User').count({ name: value }, function(err, count) {
        if (err) {
            return done(err);
        } 
        // If `count` is greater than zero, "invalidate"
        done(!count);
    });
}, 'name already exists');
schema.path('email').validate(function(value, done) {
    this.model('User').count({ email: value }, function(err, count) {
        if (err) {
            return done(err);
        } 
        done(!count);
    });
}, 'email already exists');
/* projectfilter
    0：自己的项目
    1：全部项目
    2：正在进行的项目
    3：已上线的项目
    4：已暂停的项目
    5：已终止的项目
*/
mongoose.model('User', schema);