'use strict';

const express = require('express');
const router = express.Router();
const { body, param, matchedData } = require('express-validator');

const { createShoppingList, allShoppingLists, getShoppingList } = require('../controllers/shoppingList-controller');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');

const { isValidMongoId } = require('../utils/helpers');

router.post(
  '/shopping-list',
  checkJwt('getCurrentUser'),
  body('name').not().isEmpty().trim().escape().isLength({ min: 4, max: 255 }),
  validateRequest,
  async (req, res, next) => {
    try {
      const response = await createShoppingList(matchedData(req, { locations: ['body'] }), req.userId);

      if (response) res.status(201).send({ message: 'Shopping List successfully registered' });
      else res.status(400).send({ message: 'Shopping List cannot be registered' });
    } catch (error) {
      next(error);
    }
  },
);

router.get('/shopping-lists', checkJwt('isAdmin'), async (req, res, next) => {
  try {
    const shoppingLists = await allShoppingLists();

    res.status(200).send(shoppingLists);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/shopping-lists/:userId',
  checkJwt('isSamePersonOrAdmin'),
  param('userId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const shoppingLists = await allShoppingLists(userId);

      res.status(200).send(shoppingLists);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/shopping-list/:shoppingListId/user/:userId',
  checkJwt('isSamePersonOrAdmin'),
  param('shoppingListId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  param('userId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId, userId } = req.params;

      const shoppingList = await getShoppingList(shoppingListId, userId);

      res.status(200).send(shoppingList);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/shopping-list/:shoppingListId',
  checkJwt('isSamePersonOrAdmin'),
  param('shoppingListId').not().isEmpty().isString().trim().escape(),
  body('name').isString().trim().escape().isLength({ min: 4, max: 255 }),
  validateRequest,
  async (req, res, next) => {
    try {
      const queryData = matchedData(req, { locations: ['body'] });
      res.status(201).send(queryData);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/shopping-list/:shoppingListId',
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

module.exports = {
  shoppingListRoute: router,
};
