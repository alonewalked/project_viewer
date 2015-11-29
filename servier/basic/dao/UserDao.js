// user dao
var DaoBase = require('./DaoBase'),
    model = require('../models/index').User;

module.exports = new DaoBase(model);