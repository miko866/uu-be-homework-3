'use strict';

const express = require('express');
const router = express.Router();
const { body, param, matchedData } = require('express-validator');

const {
  createShoppingList,
  addUserToShoppingList,
  allShoppingLists,
  getShoppingList,
  updateShoppingList,
  deleteAllowedUsers,
  deleteShoppingList,
} = require('../controllers/shoppingList-controller');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');

const { isValidMongoId } = require('../utils/helpers');

router.post(
  '/shopping-list',
  checkJwt('getCurrentUser'),
  body('name').not().isEmpty().trim().escape().isLength({ min: 2, max: 255 }),
  body('allowedUsers.*')
    .optional({ nullable: true })
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const response = await createShoppingList(matchedData(req, { locations: ['body'] }), req.currentUser.userId);

      if (response) res.status(201).send({ message: 'Shopping List successfully created' });
      else res.status(400).send({ message: 'Shopping List cannot be created' });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/shopping-list/:shoppingListId/add-user',
  checkJwt('isOwnerOrAdmin'),
  param('shoppingListId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  body('userId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId } = req.params;
      const response = await addUserToShoppingList(matchedData(req, { locations: ['body'] }), shoppingListId);
      if (response) res.status(201).send({ message: 'User  successfully added' });
      else res.status(400).send({ message: 'User cannot be added' });
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
  checkJwt('isOwnerOrAdmin'),
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
  '/shopping-list/:shoppingListId',
  checkJwt('isAllowed'),
  param('shoppingListId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId } = req.params;

      const response = await getShoppingList(shoppingListId);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/shopping-list/:shoppingListId',
  checkJwt('isOwnerOrAdmin'),
  param('shoppingListId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  body('name').isString().trim().escape().isLength({ min: 4, max: 255 }),
  body('allowedUsers.*')
    .optional({ nullable: true })
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId } = req.params;
      const bodyData = matchedData(req, { locations: ['body'] });

      const response = await updateShoppingList(shoppingListId, bodyData);

      if (response) res.status(201).send({ message: 'Shopping list successfully updated' });
      else res.status(400).send({ message: 'Shopping list cannot be updated' });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/shopping-list/:shoppingListId/remove-user',
  checkJwt('isOwnerOrAdmin'),
  param('shoppingListId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  body('allowedUserId')
    .not()
    .isEmpty()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId } = req.params;
      const bodyData = matchedData(req, { locations: ['body'] });

      const response = await deleteAllowedUsers(shoppingListId, bodyData);

      if (response) res.status(204).send();
      else res.status(400).send({ message: `Allowed user/s cannot be deleted` });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/shopping-list/:shoppingListId',
  checkJwt('isOwnerOrAdmin'),
  param('shoppingListId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId } = req.params;

      const response = await deleteShoppingList(shoppingListId);

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
