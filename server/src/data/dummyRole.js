'use strict';

const Role = require('../models/role-model');

const { ROLE } = require('../utils/constants');

const DUMMY_ROLE = [
  new Role({
    name: ROLE.admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Role({
    name: ROLE.user,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
];

module.exports = {
  DUMMY_ROLE,
};
