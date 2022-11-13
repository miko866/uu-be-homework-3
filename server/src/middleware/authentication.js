'use strict';

const jwt = require('jsonwebtoken');
const env = require('env-var');

const logger = require('../utils/logger');
const { getRole } = require('../controllers/role-controller');

const { NotAuthorizedError } = require('../utils/errors');
const { AUTH_MODE, ROLE } = require('../utils/constants');

/**
 * Check if JWT token agree with JWT secret key
 * @param {authorization} req
 * @param {none} res
 * @param {next step} next
 */
const checkJwt = (value) => {
  return async (req, res, next) => {
    try {
      // Take token from http request
      const tokenOrigin = req.headers.authorization;
      if (!tokenOrigin) throw new NotAuthorizedError();

      let token = '';

      // Check if prefix is Bearer or not and take only token
      if (tokenOrigin.includes('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      } else token = tokenOrigin;

      let decoded = null;
      try {
        decoded = jwt.verify(token, env.get('JWT_SECRET').required().asString());
      } catch (err) {
        throw new NotAuthorizedError();
      }

      if (value === AUTH_MODE.getCurrentUser) {
        req.userId = decoded.id;
        next();
      } else if (value) {
        // Check JWT custom value
        let response = null;
        let userId = null;

        if (value === AUTH_MODE.isSamePersonOrAdmin) userId = req.params.userId;
        // eslint-disable-next-line no-use-before-define
        response = await trySwitch(value, token, userId);

        if (response === 'admin') {
          req.isAdmin = true;
          next();
        } else if (response) next();
        else throw new NotAuthorizedError();
      } else {
        req.token = token;
        next();
      }
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Routing for additional authorization rules
 * @param {String} value
 * @param {String} token
 * @returns Boolean
 */
const trySwitch = async (value, token, userId) => {
  switch (value) {
    case AUTH_MODE.isAdmin:
      // eslint-disable-next-line no-use-before-define
      return await checkIsAdmin(token);
    case AUTH_MODE.isSamePersonOrAdmin:
      // eslint-disable-next-line no-use-before-define
      return await checkIsSamePersonOrAdmin(token, userId);
    case AUTH_MODE.isOwner:
      // eslint-disable-next-line no-use-before-define
      return true;
    case AUTH_MODE.isAllowed:
      // eslint-disable-next-line no-use-before-define
      return true;
    default:
      logger.error(`Sorry, you are out of ${value}.`);
      throw new NotAuthorizedError();
  }
};

/**
 * Check if user is Admin from JWT-Token
 * @param {String} token
 * @returns Boolean
 */
const checkIsAdmin = async (token) => {
  try {
    const decoded = jwt.verify(token, env.get('JWT_SECRET').required().asString());
    const role = await getRole(decoded.role, undefined);
    if (role.name !== ROLE.admin) throw new NotAuthorizedError();

    return true;
  } catch (error) {
    logger.error(`Error checkIsAdmin: ${error}.`);
    throw new NotAuthorizedError();
  }
};

/**
 * A user can only update himself. An Admin can update all.
 * @param {String} token
 * @param {String} userId
 * @returns Boolean || String
 */
const checkIsSamePersonOrAdmin = async (token, userId) => {
  try {
    const decoded = jwt.verify(token, env.get('JWT_SECRET').required().asString());
    const role = await getRole(decoded.role, undefined);

    if (decoded.id === userId && role.name === ROLE.admin) return 'admin';
    else if (role.name === ROLE.admin) return 'admin';
    else if (decoded.id === userId) return true;
    else return false;
  } catch (error) {
    logger.error(`Error checkIsSamePersonOrAdmin: ${error}.`);
    throw new NotAuthorizedError();
  }
};

module.exports = { checkJwt };
