'use strict';

const ShoppingList = require('../models/shoppingList-model');

const { DUMMY_USER } = require('./dummyUser');

const DUMMY_SHOPPING_LIST = [
  new ShoppingList({
    name: 'test01',
    userId: DUMMY_USER[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new ShoppingList({
    name: 'test02',
    userId: DUMMY_USER[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new ShoppingList({
    name: 'test03',
    userId: DUMMY_USER[1]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
];

module.exports = {
  DUMMY_SHOPPING_LIST,
};
