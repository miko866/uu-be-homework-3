'use strict';

/**
 * All Custom Errors
 */
class GeneralError extends Error {
  constructor(message, code = 500) {
    super();
    this.message = message;
    this.code = code;
  }
}

class BadRequestError extends GeneralError {
  constructor(message) {
    super(message, 400);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

class NotFoundError extends GeneralError {
  constructor(message) {
    super(message ?? 'Not found.', 404);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return { message: this.message ?? 'Not found' };
  }
}

class InternalServerError extends GeneralError {
  constructor(message) {
    super(message ?? 'You shall not pass!', 500);

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeErrors() {
    return { message: this.message ?? 'You shall not pass!' };
  }
}

class RequestValidationError extends GeneralError {
  constructor(errors) {
    super('Invalid request parameters', 422);
    this.errors = errors;

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }));
  }
}

class ConflictError extends GeneralError {
  constructor(message) {
    super(message ?? 'Conflict', 409);

    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeErrors() {
    return { message: this.message ?? 'Conflict' };
  }
}

class NotAuthorizedError extends GeneralError {
  constructor(message) {
    super(message ?? 'Not Authorized', 401);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return { message: this.message ?? 'Not Authorized' };
  }
}

class ForbiddenError extends GeneralError {
  constructor(message) {
    super(message ?? 'Forbidden', 403);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return { message: this.message ?? 'Forbidden' };
  }
}

module.exports = {
  GeneralError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
  RequestValidationError,
  ConflictError,
  NotAuthorizedError,
  ForbiddenError,
};
