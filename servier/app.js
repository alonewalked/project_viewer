/**
 * Module dependencies.
 */
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var routes = require('./routes/index');
var express = require('express')
    , http = require('http')
    , path = require('path')
    , fs = require('fs')
    , colors = require('colors');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type'); 
    next();
}
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(allowCrossDomain);  // set cross-domain;
app.use('/', routes);
app.set('port', 1212);
var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log('Express start @' + app.get('port'));
});
module.exports = app;