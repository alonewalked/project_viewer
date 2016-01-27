// branch model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Mixed = Schema.Types.Mixed;

var schema = new Schema({
    projectcategory:{ type:[String] },
    projectfilter:{ type:[String] },
    projectsvn:{ type: {} },      // json
    projectstatus:{ type: [ {} ] },    // json
    bugzilla: {type: {} }
});

mongoose.model('ServerConfig', schema);
