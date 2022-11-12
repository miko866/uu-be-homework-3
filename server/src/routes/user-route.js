'use strict';

const express = require('express');
const router = express.Router();
const { body, param, matchedData } = require('express-validator');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');

router.post(
  '/user/register',
  body('email').not().isEmpty().trim().escape().isEmail(),
  body('firstName').not().isEmpty().trim().escape().isLength({ min: 2, max: 255 }),
  body('lastName').not().isEmpty().trim().escape().isLength({ min: 2, max: 255 }),
  body('password').not().isEmpty().isString().trim().escape().isLength({ min: 4 }),
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
      const queryData = matchedData(req, { locations: ['body'] });
      res.status(201).send(queryData);
    } catch (error) {
      next(error);
    }
  },
);

router.get('/user/current-user', checkJwt(), async (req, res, next) => {
  try {
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.get('/users', checkJwt(), validateRequest, async (req, res, next) => {
  try {
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.get(
  '/user/:userId',
  checkJwt(),
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

router.patch(
  '/user/:userId',
  checkJwt('isSamePersonOrAdmin'),
  param('userId').not().isEmpty().isString().trim().escape(),
  body('firstName').isString().trim().escape().isLength({ min: 2, max: 255 }).optional({ nullable: true }),
  body('lastName').isString().trim().escape().isLength({ min: 2, max: 255 }).optional({ nullable: true }),
  body('email').trim().escape().isEmail().optional({ nullable: true }),
  body('password').isString().trim().escape().isLength({ min: 4 }).optional({ nullable: true }),
  body('roleId').isString().trim().escape().optional({ nullable: true }),
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
  '/user/:userId',
  checkJwt(),
  param('userId').not().isEmpty().isString().trim().escape(),
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
  userRoute: router,
};
