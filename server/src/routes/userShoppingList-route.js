'use strict';

const express = require('express');
const router = express.Router();
const { body, param, matchedData } = require('express-validator');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');


router.post(
  '/user-shopping-list',
  checkJwt('isOwner'),
  body('userId').not().isEmpty().isString().trim().escape(),
  body('shoppingListId').not().isEmpty().isString().trim().escape(),
  body('access').not().isEmpty().isBoolean(),
  validateRequest,
  async (req, res, next) => {
    try {
      const queryData = matchedData(req, { locations: ['body'] });
      res.status(200).send(queryData);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/user-shopping-list/:shoppingListId/current-user',
  checkJwt('isOwner'),
  param('shoppingListId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  async (req, res, next) => {
    try {
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/user-shopping-lists/current-user',
  checkJwt('isOwner'),
  param('shoppingListId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  async (req, res, next) => {
    try {
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/user-shopping-lists/:userId',
  checkJwt('isAdmin'),
  param('shoppingListId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  async (req, res, next) => {
    try {
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/user-shopping-lists/:shoppingListId',
  checkJwt('isOwner'),
  param('shoppingListId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  async (req, res, next) => {
    try {
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

// TODO: miss delete for ADMIN depends by selected user ID ??
module.exports = {
  userShoppingListRoute: router,
};
