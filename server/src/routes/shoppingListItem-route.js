'use strict';

const express = require('express');
const router = express.Router();
const { body, param, matchedData, check } = require('express-validator');

const { createShoppingListItems } = require('../controllers/shoppingListItem-controller');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');

const { isValidMongoId } = require('../utils/helpers');

router.post(
  '/shopping-list/:shoppingListId/items',
  checkJwt(),
  param('shoppingListId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  check('items.*.name').not().isEmpty().trim().escape().isLength({ min: 4, max: 255 }),
  check('items.*.status').not().isEmpty().isBoolean(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId } = req.params;
      const response = await createShoppingListItems(matchedData(req, { locations: ['body'] }), shoppingListId);

      if (response) res.status(201).send({ message: 'Shopping List Items successfully registered' });
      else res.status(400).send({ message: 'Shopping List Items cannot be registered' });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/shopping-list/:shoppingListId/items',
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

router.get(
  '/shopping-list/:shoppingListId/item/:itemId',
  checkJwt('isAllowed'),
  param('shoppingListId').not().isEmpty().isString().trim().escape(),
  param('itemId').not().isEmpty().isString().trim().escape(),
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
  'shopping-list/:shoppingListId/item/:itemId',
  checkJwt('isAllowed'),
  param('shoppingListId').not().isEmpty().isString().trim().escape(),
  param('itemId').not().isEmpty().isString().trim().escape(),
  body('name').isString().trim().escape().isLength({ min: 4, max: 255 }).optional({ nullable: true }),
  body('status').isBoolean().optional({ nullable: true }),
  validateRequest,
  async (req, res, next) => {
    try {
      const queryData = matchedData(req, { locations: ['body', 'param'] });
      res.status(201).send(queryData);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/shopping-list/:shoppingListId/items',
  checkJwt('isAllowed'),
  param('shoppingListId').not().isEmpty().isString().trim().escape(),
  body('ids.*').not().isEmpty().isString().trim().escape(),
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
  shoppingListItemRoute: router,
};
