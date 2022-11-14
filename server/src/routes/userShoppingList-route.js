'use strict';

const express = require('express');
const router = express.Router();
const { body, param, matchedData } = require('express-validator');

const { createAllowUsers } = require('../controllers/userShoppingList-controller');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');

const { isValidMongoId } = require('../utils/helpers');

router.post(
  '/users-shopping-list/user/:userId',
  checkJwt('isSamePersonOrAdmin'),
  body('ids.*')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  body('shoppingListId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const response = await createAllowUsers(matchedData(req, { locations: ['body'] }));

      if (response) res.status(201).send({ message: 'Allowd user for shopping list successfully created' });
      else res.status(400).send({ message: 'Shopping List Items cannot be registered' });
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
