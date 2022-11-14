'use strict';

const UserShoppingList = require('../models/userShoppingList-model');

const { DUMMY_USER } = require('./dummyUser');
const { DUMMY_SHOPPING_LIST } = require('./dummyShoppingList');

const DUMMY_USER_SHOPPING_LIST = [
  new UserShoppingList({
    userId: DUMMY_USER[1],
    shoppingListId: DUMMY_SHOPPING_LIST[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new UserShoppingList({
    userId: DUMMY_USER[1],
    shoppingListId: DUMMY_SHOPPING_LIST[1],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
];

module.exports = {
  DUMMY_USER_SHOPPING_LIST,
};
