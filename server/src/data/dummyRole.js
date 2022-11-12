'use strict';

const Role = require('../models/role-model');

const { ROLE } = require('../utils/constants');

const DUMMY_ROLE = [
  new Role({
    name: ROLE.admin,
  }),
  new Role({
    name: ROLE.user,
  }),
];

module.exports = {
  DUMMY_ROLE,
};
