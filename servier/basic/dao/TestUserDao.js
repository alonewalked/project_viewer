// testuser dao
var DaoBase = require('./DaoBase'),
    model = require('../models').TestUser;

module.exports = new DaoBase(model);