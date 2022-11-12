'use strict';

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { validateRequest } = require('../middleware/validate-request');

const { login } = require('../controllers/auth-controller');

router.post(
  '/login',
  body('email').not().isEmpty().isEmail().trim().escape(),
  body('password').not().isEmpty().isString().trim().escape().isLength({ min: 4 }),
  validateRequest,
  async (req, res, next) => {
    try {
      const token = await login(req.body);

      res.status(200).send({ token });
      return;
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  authRoute: router,
};
