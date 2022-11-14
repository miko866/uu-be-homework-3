'use strict';

const express = require('express');
const router = express.Router();
const { body, param, matchedData } = require('express-validator');

const {
  registerUser,
  createUser,
  updateUser,
  deleteUser,
  allUsers,
  getUser,
} = require('../controllers/user-controller');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');

const { isValidMongoId } = require('../utils/helpers');

router.post(
  '/user/register',
  body('email').not().isEmpty().trim().escape().isEmail(),
  body('firstName').not().isEmpty().trim().escape().isLength({ min: 2, max: 255 }),
  body('lastName').not().isEmpty().trim().escape().isLength({ min: 2, max: 255 }),
  body('password').not().isEmpty().isString().trim().escape().isLength({ min: 4 }),
  validateRequest,
  async (req, res, next) => {
    try {
      const response = await registerUser(matchedData(req, { locations: ['body'] }));

      if (response) res.status(201).send({ message: 'User successfully registered' });
      else res.status(400).send({ message: 'User cannot be registered' });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/user/create',
  checkJwt('isAdmin'),
  body('firstName').isString().trim().escape().isLength({ min: 2, max: 255 }),
  body('lastName').isString().trim().escape().isLength({ min: 2, max: 255 }),
  body('email').not().isEmpty().trim().escape().isEmail(),
  body('password').not().isEmpty().isString().trim().escape().isLength({ min: 4 }),
  body('roleId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  async (req, res, next) => {
    try {
      const response = await createUser(matchedData(req, { locations: ['body'] }));

      if (response) res.status(201).send({ message: 'User successfully created' });
      else res.status(400).send({ message: 'User cannot be created' });
    } catch (error) {
      next(error);
    }
  },
);

router.get('/users', checkJwt(), async (req, res, next) => {
  try {
    const response = await allUsers();

    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/user/:userId',
  checkJwt(),
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

      const response = await getUser(userId);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/user/:userId',
  checkJwt('checkIsOwnerOrAdmin'),
  param('userId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  body('firstName').isString().trim().escape().isLength({ min: 2, max: 255 }).optional({ nullable: true }),
  body('lastName').isString().trim().escape().isLength({ min: 2, max: 255 }).optional({ nullable: true }),
  body('email').trim().escape().isEmail().optional({ nullable: true }),
  body('password').isString().trim().escape().isLength({ min: 4 }).optional({ nullable: true }),
  body('roleId').isString().trim().escape().optional({ nullable: true }),
  validateRequest,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const bodyData = matchedData(req, { locations: ['body'] });
      const isAdmin = req.isAdmin;

      const response = await updateUser(userId, bodyData, isAdmin);

      if (response) res.status(201).send({ message: 'User successfully updated' });
      else res.status(400).send({ message: 'User cannot be updated' });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/user/:userId',
  checkJwt('checkIsOwnerOrAdmin'),
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

      const response = await deleteUser(userId);

      if (response) res.status(204).send();
      else res.status(400).send({ message: `User cannot be deleted` });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  userRoute: router,
};
