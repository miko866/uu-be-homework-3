'use strict';

const express = require('express');
const router = express.Router();
const { body, param, matchedData, check } = require('express-validator');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');

router.post(
  '/shopping-list/:shoppingListId/items',
  checkJwt('isAllowed'),
  param('shoppingListId').not().isEmpty().isString().trim().escape(),
  check('items.*.name').not().isEmpty().trim().escape().isLength({ min: 4, max: 255 }),
  check('items.*.status').not().isEmpty().isBoolean(),
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
