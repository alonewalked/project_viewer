// branch model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
    projectcategory:{ type:[String] },
    projectfilter:{ type:[String] },
    projectsvn:{ type:String}   // json string
});

mongoose.model('ServerConfig', schema);
