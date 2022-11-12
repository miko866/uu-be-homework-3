'use strict';

const { validationResult } = require('express-validator');
const { RequestValidationError } = require('../utils/errors');

/**
 * Express middleware validator
 * @param {func} req
 * @param {func} res
 * @param {func} next
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};

module.exports = { validateRequest };
