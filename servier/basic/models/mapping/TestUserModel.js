// test user model 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
    name:{ type:String, required: true },    
    password:{ type:String, required: true },
    desc:{ type:String }
}); 

schema.path('name').validate(function(value, done) {
    this.model('TestUser').count({ name: value }, function(err, count) {
        if (err) {
            return done(err);
        } 
        done(!count);
    });
}, 'test name already exists');

mongoose.model('TestUser', schema);
