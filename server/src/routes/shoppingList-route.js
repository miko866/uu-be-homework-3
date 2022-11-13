'use strict';

const express = require('express');
const router = express.Router();
const { body, param, matchedData } = require('express-validator');

const {
  createShoppingList,
  allShoppingLists,
  getShoppingList,
  updateShoppingList,
  deleteShoppingList,
} = require('../controllers/shoppingList-controller');

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
    const response = await allShoppingLists();

    res.status(200).send(response);
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
      const response = await allShoppingLists(userId);

      res.status(200).send(response);
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

      const response = await getShoppingList(shoppingListId, userId);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
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
  body('name').isString().trim().escape().isLength({ min: 4, max: 255 }),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId, userId } = req.params;
      const bodyData = matchedData(req, { locations: ['body'] });
      const isAdmin = req.isAdmin;

      const response = await updateShoppingList(shoppingListId, userId, bodyData, isAdmin);

      if (response) res.status(201).send({ message: 'Shopping list successfully updated' });
      else res.status(400).send({ message: 'Shopping list cannot be updated' });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
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

      const response = await deleteShoppingList(shoppingListId, userId);

      if (response) res.status(204).send();
      else res.status(400).send({ message: `Shopping List cannot be deleted` });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  shoppingListRoute: router,
};
