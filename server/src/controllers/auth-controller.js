'use strict';

const crypto = require('crypto');

const User = require('../models/user-model');
const { NotAuthorizedError } = require('../utils/errors');
const { generateJwtToken } = require('../utils/jwt-token');

/**
 * Simple Login per JWT Token
 * @param {String} email
 * @param {String} password
 * @returns {String} JWT Token
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+encrypt_password').select('+salt').select('+roleId').lean();

  if (!user) throw new NotAuthorizedError();

  const securePassword = (plainPassword) => crypto.createHmac('sha512', user.salt).update(plainPassword).digest('hex');

  if (securePassword(password) !== user.encrypt_password) throw new NotAuthorizedError();

  return generateJwtToken(user._id, 'role', user.roleId, 'JWT_SECRET');
};

module.exports = { login };
