'use strict';

const AUTH_MODE = {
  isAdmin: 'isAdmin',
  isSamePersonOrAdmin: 'isSamePersonOrAdmin',
  getCurrentUser: 'getCurrentUser',
  isOwner: 'isOwner',
  isAllowed: 'isAllowed',
};

const ROLE = {
  admin: 'admin',
  user: 'user',
};

module.exports = {
  AUTH_MODE,
  ROLE,
};
