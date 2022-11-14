'use strict';

const User = require('../models/user-model');

const { DUMMY_ROLE } = require('./dummyRole');

const DUMMY_USER = [
  // adminPassword
  new User({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@gmail.com',
    encrypt_password:
      '2dc1e70234e738211cfb984338a4b56aece53f8e1cc4585419e69b545c9c6b1ab7859399fde1e81c9ff34d1dba5c461fedaa573a734e054650c8ed49bd5e66ef',
    roleId: DUMMY_ROLE[0]._id,
    salt: 'ba1c23c5-875f-4d80-ac92-fcb90e6b7150',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  // userPassword
  new User({
    firstName: 'Simple',
    lastName: 'User',
    email: 'simpleuser@gmail.com',
    encrypt_password:
      'd8f5dbfbddf057119587f8f8b38875c030e2e49df1749e4b40e62dcf87c177e2263d31f6612acb60712cd2675f014edad0be075211639bcd24d581795a059f26',
    roleId: DUMMY_ROLE[1]._id,
    salt: '02ba3ee1-52c0-4993-845c-606f7c4de92e',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  // userPassword
  new User({
    firstName: 'Simple',
    lastName: 'User2',
    email: 'simpleuser2@gmail.com',
    encrypt_password:
      'd8f5dbfbddf057119587f8f8b38875c030e2e49df1749e4b40e62dcf87c177e2263d31f6612acb60712cd2675f014edad0be075211639bcd24d581795a059f26',
    roleId: DUMMY_ROLE[1]._id,
    salt: '02ba3ee1-52c0-4993-845c-606f7c4de92e',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
];

module.exports = {
  DUMMY_USER,
};
