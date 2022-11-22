'use strict';

const env = require('env-var');
const MongoClient = require('mongodb').MongoClient;

const { DUMMY_ROLE } = require('../data/dummyRole');
const { DUMMY_USER } = require('../data/dummyUser');
const { DUMMY_SHOPPING_LIST } = require('../data/dummyShoppingList');
const { DUMMY_SHOPPING_LIST_ITEM } = require('../data/dummyShoppingListItem');

const logger = require('../utils/logger');

const { BadRequestError } = require('../utils/errors');

/**
 * Seed DB with dummy data
 * Beware of the order
 */
const createDummyData = async () => {
  const mongoUri = env.get('MONGO_URI_DOCKER_SEED').required().asUrlString();
  const mongoDbName = env.get('DB_NAME').required().asString();

  const client = new MongoClient(mongoUri);
  try {
    await client.connect();

    logger.info('Connected correctly to the Database.');

    // Create Collections
    const roleCollection = client.db(mongoDbName).collection('role');
    const userCollection = client.db(mongoDbName).collection('user');
    const shoppingListCollection = client.db(mongoDbName).collection('shoppingList');
    const shoppingListItemCollection = client.db(mongoDbName).collection('shoppingListItem');

    const collections = await client.db(mongoDbName).collections();

    // Drop Collections if exists
    if (collections.length !== 0) {
      try {
        await Promise.all(
          Object.values(collections).map(async (collection) => {
            await collection.deleteMany({});
          }),
        );
      } catch (error) {
        logger.error(`Database dropping had problems: ${error}`);
        throw new BadRequestError('Database dropping had problems');
      }
    }

    // Seed DB
    await roleCollection.insertMany(DUMMY_ROLE);
    await userCollection.insertMany(DUMMY_USER);
    await shoppingListCollection.insertMany(DUMMY_SHOPPING_LIST);
    await shoppingListItemCollection.insertMany(DUMMY_SHOPPING_LIST_ITEM);

   await userCollection.findOneAndUpdate(
      { firstName: 'Admin' },
      {
        $set: {
          shoppingLists: [DUMMY_SHOPPING_LIST[0]._id, DUMMY_SHOPPING_LIST[1]._id],
        },
      },
    );
    await userCollection.findOneAndUpdate(
      { firstName: 'Simple' },
      {
        $set: {
          shoppingLists: [DUMMY_SHOPPING_LIST[2]._id],
        },
      },
    );

    await shoppingListCollection.findOneAndUpdate(
      { name: 'test01' },
      {
        $set: {
          shoppingListItems: [
            DUMMY_SHOPPING_LIST_ITEM[0]._id,
            DUMMY_SHOPPING_LIST_ITEM[1]._id,
            DUMMY_SHOPPING_LIST_ITEM[2]._id,
          ],
          allowedUsers: [DUMMY_USER[1]._id, DUMMY_USER[2]._id],
        },
      },
    );
    await shoppingListCollection.findOneAndUpdate(
      { name: 'test02' },
      {
        $set: {
          shoppingListItems: [DUMMY_SHOPPING_LIST_ITEM[3]._id, DUMMY_SHOPPING_LIST_ITEM[4]._id],
          allowedUsers: [DUMMY_USER[1]._id],
        },
      },
    );
    await shoppingListCollection.findOneAndUpdate(
      { name: 'test03' },
      {
        $set: {
          shoppingListItems: [DUMMY_SHOPPING_LIST_ITEM[5]._id, DUMMY_SHOPPING_LIST_ITEM[6]._id],
          allowedUsers: [DUMMY_USER[2]._id],
        },
      },
    );

    logger.info('Database has been seeded successfully.');
  } catch (err) {
    logger.error(`Database seeding has been unsuccessful: ${err}`);
    throw new BadRequestError('Database seeding has been unsuccessful');
  }
};

module.exports = createDummyData;
