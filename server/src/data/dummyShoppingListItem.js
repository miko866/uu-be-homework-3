'use strict';

const ShoppingListItem = require('../models/shoppingListItem-model');

const { DUMMY_SHOPPING_LIST } = require('./dummyShoppingList');

const DUMMY_SHOPPING_LIST_ITEM = [
  new ShoppingListItem({
    name: 'test01 - 01',
    status: false,
    shoppingListId: DUMMY_SHOPPING_LIST[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new ShoppingListItem({
    name: 'test02 - 01',
    status: false,
    shoppingListId: DUMMY_SHOPPING_LIST[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new ShoppingListItem({
    name: 'test03 - 01',
    status: false,
    shoppingListId: DUMMY_SHOPPING_LIST[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new ShoppingListItem({
    name: 'test01 - 02',
    status: false,
    shoppingListId: DUMMY_SHOPPING_LIST[1]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new ShoppingListItem({
    name: 'test02 - 02',
    status: false,
    shoppingListId: DUMMY_SHOPPING_LIST[1]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new ShoppingListItem({
    name: 'test03 - 01',
    status: false,
    shoppingListId: DUMMY_SHOPPING_LIST[2]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new ShoppingListItem({
    name: 'test03 - 02',
    status: false,
    shoppingListId: DUMMY_SHOPPING_LIST[2]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
];

module.exports = {
  DUMMY_SHOPPING_LIST_ITEM,
};
