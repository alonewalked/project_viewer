// log dao
var DaoBase = require('./DaoBase'),
    model = require('../models').Log;

module.exports = new DaoBase(model);