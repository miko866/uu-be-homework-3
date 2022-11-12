'use strict';

const Pino = require('pino');
const env = require('env-var');

// Global logger
const logger = Pino(
  env.get('NODE_ENV').required().asString() === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
        level: 'trace',
      }
    : undefined,
);

module.exports = logger;
