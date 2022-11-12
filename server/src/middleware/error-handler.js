'use strict';

const logger = require('../utils/logger');
const { GeneralError } = require('../utils/errors');
const {arrayObjectUnique} = require('../utils/helpers')

/**
 * Global error handler
 * @param {func} err
 * @param {func} req
 * @param {func} res
 * @param {func} next
 * @returns Error
 */
const errorHandler = (error, req, res, next) => {
  logger.error(`Handle Errors: ${error}`);

  // Removes duplicates records
  if (error?.errors) {
      error.errors = arrayObjectUnique(error.errors, 'param');
  }

  if (error instanceof GeneralError) {
    return res.status(error.code).send(error.serializeErrors());
  }

  return res.status(400).send({
    message: 'Something went wrong',
  });
};

module.exports = errorHandler;
