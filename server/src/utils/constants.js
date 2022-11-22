'use strict';

const AUTH_MODE = {
  isAdmin: 'isAdmin',
  isOwnerOrAdmin: 'isOwnerOrAdmin',
  isAllowed: 'isAllowed',
  getCurrentUser: 'getCurrentUser',
};

const ROLE = {
  admin: 'admin',
  user: 'user',
};

module.exports = {
  AUTH_MODE,
  ROLE,
};
