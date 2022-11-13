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
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();

    logger.info('Connected correctly to the Database.');

    // Create Collections
    const roleCollection = client.db('uu_homeworks').collection('role');
    const userCollection = client.db('uu_homeworks').collection('user');
    const shoppingListCollection = client.db('uu_homeworks').collection('shoppingList');
    const shoppingListItemCollection = client.db('uu_homeworks').collection('shoppingListItem');

    const collections = await client.db('uu_homeworks').collections();

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
    roleCollection.insertMany(DUMMY_ROLE);
    userCollection.insertMany(DUMMY_USER);
    shoppingListCollection.insertMany(DUMMY_SHOPPING_LIST);
    shoppingListItemCollection.insertMany(DUMMY_SHOPPING_LIST_ITEM);

    userCollection.findOneAndUpdate(
      { firstName: 'Admin' },
      {
        $set: {
          shoppingLists: [DUMMY_SHOPPING_LIST[0]._id, DUMMY_SHOPPING_LIST[1]._id],
        },
      },
    );
    userCollection.findOneAndUpdate(
      { firstName: 'Simple' },
      {
        $set: {
          shoppingLists: [DUMMY_SHOPPING_LIST[2]._id],
        },
      },
    );

    shoppingListCollection.findOneAndUpdate(
      { name: 'test01' },
      {
        $set: {
          shoppingListItems: [
            DUMMY_SHOPPING_LIST_ITEM[0]._id,
            DUMMY_SHOPPING_LIST_ITEM[1]._id,
            DUMMY_SHOPPING_LIST_ITEM[2]._id,
          ],
        },
      },
    );
    shoppingListCollection.findOneAndUpdate(
      { name: 'test02' },
      {
        $set: {
          shoppingListItems: [DUMMY_SHOPPING_LIST_ITEM[3]._id, DUMMY_SHOPPING_LIST_ITEM[4]._id],
        },
      },
    );
    shoppingListCollection.findOneAndUpdate(
      { name: 'test03' },
      {
        $set: {
          shoppingListItems: [DUMMY_SHOPPING_LIST_ITEM[5]._id, DUMMY_SHOPPING_LIST_ITEM[6]._id],
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
