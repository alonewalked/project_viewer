// db
var mongoose = require('mongoose');
var fs = require('fs');
var Path = require('path');

// Connect mongodb firstly
var MONGO_URL = 'mongodb://10.1.30.43:27017/ife';

var models_path = Path.join(__dirname,'mapping');
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path + '/' + file);
    var modelName = file.replace('Model.js', '');
    exports[modelName] = mongoose.model(modelName);
});

var DB = function(dbpath,manual){
    this.dbpath = dbpath || MONGO_URL;
    if(!manual){
        this.connect();
    }
};

DB.prototype.connect = function(){
    mongoose.connect(this.dbpath);
    this.connected = mongoose.connection;
}

exports['DB'] = DB; 
