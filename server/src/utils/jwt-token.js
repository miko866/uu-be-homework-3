'use strict';

const mongoose = require('mongoose');
const env = require('env-var');
const jwt = require('jsonwebtoken');

/**
 * Generate dynamic JWT-Token
 * @param {String} userId
 * @param {String} objectKey
 * @param {String} objectValue
 * @param {String} envJwtSecret
 * @returns String
 */
const generateJwtToken = (userId, objectKey, objectValue, envJwtSecret) => {
  return jwt.sign(
    { id: mongoose.Types.ObjectId(userId).toString(), [objectKey]: objectValue.toString() },
    env.get(envJwtSecret).required().asString(),
    {
      algorithm: 'HS512',
      expiresIn: env.get('JWT_EXPIRES_IN').required().asString(),
      audience: env.get('JWT_AUDIENCE').required().asString(),
      issuer: env.get('JWT_ISSUER').required().asString(),
    },
  );
};

module.exports = { generateJwtToken };
