'use strict';

const express = require('express');
const router = express.Router();
const { body, param, matchedData } = require('express-validator');

const { createShoppingList } = require('../controllers/shoppingList-controller');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');

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

router.get('/shopping-lists', checkJwt('isSamePersonOrAdmin'), async (req, res, next) => {
  try {
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.get(
  '/shopping-list/:userId',
  checkJwt('isAllowed'),
  param('userId').not().isEmpty().isString().trim().escape(),
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
  '/shopping-list/:shoppingListId',
  checkJwt('isAllowed'),
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

router.patch(
  '/shopping-list/:shoppingListId',
  checkJwt('isAllowed'),
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
