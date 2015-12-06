//project model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({ 
    bugzillaid:{ type:Number },
    name:{ type:String, required: true, unique: true },
    //desc:{ type:String },
    status:{ type:Number, default:2},
    launchdate:{ type:Date, default:Date.now },
    endtime:{ type:Date, default:Date.now},
    hosts:{ type:String },
    ownerid:{ type:ObjectId, ref:'User' }, // user id
    testpages:{ type:[String] },
    apialiasid:[{
        type: ObjectId,
        ref: 'FakeApi'
    }],
    notes:{ type:String}
});

schema.path('name').validate(function(value, done) {
    this.model('Project').count({ name: value }, function(err, count) {
        if (err) {
            return done(err);
        } 
        done(!count);
    });
}, 'project name already exists');

mongoose.model('Project', schema);
