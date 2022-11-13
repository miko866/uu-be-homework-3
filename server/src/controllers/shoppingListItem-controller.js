'use strict';

const ShoppingList = require('../models/shoppingList-model');
const ShoppingListItem = require('../models/shoppingListItem-model');

const { ConflictError, NotFoundError, NoContentError } = require('../utils/errors');

const createShoppingListItems = async (data, shoppingListId) => {
  const shoppingListExists = await ShoppingList.exists({ _id: shoppingListId });
  if (!shoppingListExists) throw new ConflictError('Shopping List does not exists');

  const payload = data.items.map((object) => {
    return { ...object, shoppingListId };
  });

  const response = await ShoppingListItem.insertMany(payload);

  if (!response) return false;

  await ShoppingList.findOneAndUpdate(
    { _id: shoppingListId },
    {
      $push: { shoppingListItems: response },
    },
  );

  return true;
};;

/**
 * Get list of all shopping lists for all users
 * @param {String} userId
 * @returns Array[Object]
 */
const allShoppingLists = async (userId) => {
  let shoppingLists = null;
  if (userId) {
    const checkUser = await User.findOne({ _id: userId }).lean();
    if (!checkUser) throw new NotFoundError("User doesn't exists");

    shoppingLists = await ShoppingList.find({ userId }).lean();
  } else shoppingLists = await ShoppingList.find().lean();

  if (shoppingLists.length === 0) throw new NoContentError('No shopping lists');
  return shoppingLists;
};

/**
 * Get one shopping list
 * @param {String} shoppingListId
 * @param {String} userId
 * @returns Object
 */
const getShoppingList = async (shoppingListId, userId) => {
  const shoppingList = await ShoppingList.findOne({ _id: shoppingListId, userId }).lean();

  if (!shoppingList) throw new NotFoundError("Shopping List doesn't exists");

  return shoppingList;
};

/**
 * Update one shopping list
 * @param {String} shoppingListId
 * @param {String} userId
 * @param {Object} data
 * @returns Boolean
 */
const updateShoppingList = async (shoppingListId, userId, data) => {
  const checkShoppingList = await ShoppingList.findOne({ _id: shoppingListId }).lean();
  if (!checkShoppingList) throw new NotFoundError("Shopping list doesn't exists");

  const filter = { _id: shoppingListId, userId };
  const update = data;
  const opts = { new: true };

  const shoppingList = await ShoppingList.findOneAndUpdate(filter, update, opts);

  if (shoppingList) return true;
  else return false;
};

/**
 * Delete one shopping list
 * @param {String} shoppingListId
 * @param {String} userId
 * @returns Boolean
 */
const deleteShoppingList = async (shoppingListId, userId) => {
  const shoppingList = await ShoppingList.findOne({ _id: shoppingListId }).lean();
  if (!shoppingList) throw new NotFoundError("Shopping List doesn't exists");

  const response = await ShoppingList.deleteOne({ _id: shoppingListId, userId });
  if (response) return true;
  else return false;
};

module.exports = { createShoppingListItems };
