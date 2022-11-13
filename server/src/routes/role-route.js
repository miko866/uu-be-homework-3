'use strict';

const express = require('express');
const router = express.Router();
const { param } = require('express-validator');

const { getRoles, getRole } = require('../controllers/role-controller');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');

const { isValidMongoId } = require('../utils/helpers');

router.get('/roles', checkJwt('isAdmin'), validateRequest, async (req, res, next) => {
  try {
    const response = await getRoles();
    res.status(200).send({ response });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/role/:roleId',
  checkJwt('isAdmin'),
  param('roleId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { roleId } = req.params;
      const response = await getRole(roleId, undefined);

      res.status(200).send({ response });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  roleRoute: router,
};
