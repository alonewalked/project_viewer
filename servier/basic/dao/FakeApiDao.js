// fake api dao
var DaoBase = require('./DaoBase'),
    model = require('../models').FakeApi;

module.exports = new DaoBase(model);