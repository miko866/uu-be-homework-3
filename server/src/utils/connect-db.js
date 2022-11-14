'use strict';

const mongoose = require('mongoose');
const env = require('env-var');

const createDummyData = require('../controllers/seeder-controller');

const logger = require('./logger');
const { InternalServerError } = require('./errors');

/**
 * Disconnect DB
 * @returns Mongo Status
 */
const disconnectDb = async () => {
  await mongoose.disconnect();
};

/**
 * Create connection to Mongo DB
 */
const connectDb = async () => {
  const mongoUri = env.get('MONGO_URI_DOCKER').required().asUrlString();

  try {
    await mongoose
      .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async (response) => {
        logger.info('Connected to database');

        // create connection object
        let db = mongoose.connection.db;
        let collections = await db.listCollections().toArray();

        // Run seeds DB with Dummy data only if DB is empty
        // in other way use seeder endpoint
        if (collections.length === 0) createDummyData();

        return response;
      })
      .catch((error) => {
        logger.error(`ERROR DB: ${error.message ?? error}`);

        disconnectDb();
        if (error instanceof Error) {
          throw new InternalServerError('DB error');
        } else {
          throw new InternalServerError();
        }
      });
  } catch (error) {
    logger.error(`ERROR Connection to DB: ${error.message ?? error}`);

    disconnectDb();
    throw new InternalServerError('Error connecting to database');
  }
};

/**
 * Check Mongo DB health status
 * @returns Mongo State
 */
const healthCheckDb = async () => {
  const mongoUri = env.get('MONGO_URI_DOCKER').required().asUrlString();
  try {
    const connection = mongoose.createConnection(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return connection.readyState;
  } catch (error) {
    logger.error(`Mongo HealthCheck: ${error}`);
    return error.message;
  }
};

module.exports = {
  connectDb,
  disconnectDb,
  healthCheckDb,
};
