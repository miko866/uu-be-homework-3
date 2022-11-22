'use strict';

const jwt = require('jsonwebtoken');
const env = require('env-var');

const logger = require('../utils/logger');
const { getRole } = require('../controllers/role-controller');
const { getShoppingList } = require('../controllers/shoppingList-controller');

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

      // Check if JWT Token is valid and decoded it
      let decoded = null;
      try {
        decoded = jwt.verify(token, env.get('JWT_SECRET').required().asString());
      } catch (err) {
        throw new NotAuthorizedError();
      }

      if (value === AUTH_MODE.getCurrentUser) {
        req.currentUser = { userId: decoded.id, roleId: decoded.role };
        next();
      } else if (value) {
        // Check JWT custom value
        let response = null;
        let ownerUserId = null;
        let ownerShoppingListId = null;
        let shoppingListId = null;

        if (value === AUTH_MODE.isOwnerOrAdmin) {
          ownerUserId = req.params.userId;
          ownerShoppingListId = req.params.shoppingListId;
        }
        if (value === AUTH_MODE.isAllowed) shoppingListId = req.params.shoppingListId;

        // eslint-disable-next-line no-use-before-define
        response = await trySwitch(value, decoded, ownerUserId, ownerShoppingListId, shoppingListId);

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
const trySwitch = async (value, decoded, ownerUserId, ownerShoppingListId, shoppingListId) => {
  switch (value) {
    case AUTH_MODE.isAdmin:
      // eslint-disable-next-line no-use-before-define
      return await checkIsAdmin(decoded);
    case AUTH_MODE.isOwnerOrAdmin:
      // eslint-disable-next-line no-use-before-define
      return await checkIsOwnerOrAdmin(decoded, ownerUserId, ownerShoppingListId);
    case AUTH_MODE.isAllowed:
      // eslint-disable-next-line no-use-before-define
      return await checkIsAllowed(decoded, shoppingListId);
    default:
      logger.error(`Sorry, you are out of ${value}.`);
      throw new NotAuthorizedError();
  }
};

/**
 * Check if user is Admin from JWT-Token
 * @param {Object} decoded
 * @returns Boolean
 */
const checkIsAdmin = async (decoded) => {
  try {
    const role = await getRole(decoded.role, undefined);
    if (role.name !== ROLE.admin) throw new NotAuthorizedError();

    return true;
  } catch (error) {
    logger.error(`Error checkIsAdmin: ${error}.`);
    throw new NotAuthorizedError();
  }
};

/**
 * the user can only work with their own resources and admin can do everything
 * @param {Object} decode
 * @param {String} ownerUserId
 * @param {String} ownerShoppingListId
 * @returns Boolean || String
 */
const checkIsOwnerOrAdmin = async (decoded, ownerUserId, ownerShoppingListId) => {
  try {
    const role = await getRole(decoded.role, undefined);
    let shoppingList = null;

    if (ownerShoppingListId) {
      shoppingList = await getShoppingList(ownerShoppingListId);
    }

    if (role.name === ROLE.admin) return 'admin';
    else if (ownerUserId && decoded.id === ownerUserId) return true;
    else if (shoppingList.userId.toString() === decoded.id) return true;
    else return false;
  } catch (error) {
    logger.error(`Error checkIsSamePersonOrAdmin: ${error}.`);
    throw new NotAuthorizedError();
  }
};

/**
 * Check allowed users for shopping list
 * @param {Object} decoded
 * @param {String} shoppingListId
 * @returns Boolean
 */
const checkIsAllowed = async (decoded, shoppingListId) => {
  try {
    const response = await checkIsOwnerOrAdmin(decoded, null, shoppingListId);

    if (response) {
      return true;
    } else {
      const shoppingList = await getShoppingList(shoppingListId);

      const response = !!shoppingList.allowedUsers.find((user) => user._id.toString() === decoded.id);

      if (response) return true;
      return false;
    }
  } catch (error) {
    logger.error(`Error checkIsSamePersonOrAdmin: ${error}.`);
    throw new NotAuthorizedError();
  }
};

module.exports = { checkJwt };
