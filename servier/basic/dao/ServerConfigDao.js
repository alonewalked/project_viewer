// server config dao
var DaoBase = require('./DaoBase'),
    model = require('../models').ServerConfig;

module.exports = new DaoBase(model);