'use strict';

const ShoppingList = require('../models/shoppingList-model');
const ShoppingListItem = require('../models/shoppingListItem-model');

const { ConflictError, NotFoundError, NoContentError } = require('../utils/errors');

/**
 * Create multiple shopping list items
 * @param {Array[Object]} data
 * @param {String} shoppingListId
 * @returns Boolean
 */
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
};

/**
 * Get list of all items by shopping list id
 * @param {String} shoppingListId
 * @returns Array[Object]
 */
const allShoppingListItems = async (shoppingListId) => {
  const checkShoppingList = await ShoppingList.findOne({ _id: shoppingListId }).lean();
  if (!checkShoppingList) throw new NotFoundError("Shopping list doesn't exists");

  const shoppingListItems = await ShoppingListItem.find({ shoppingListId }).lean();

  if (shoppingListItems.length === 0) throw new NoContentError('No shopping lists');
  return shoppingListItems;
};

/**
 * Get ona item by shopping list id
 * @param {String} shoppingListId
 * @param {String} itemId
 * @returns Object
 */
const getShoppingListItem = async (shoppingListId, itemId) => {
  const checkShoppingListItem = await ShoppingListItem.findOne({ _id: itemId, shoppingListId }).lean();
  if (!checkShoppingListItem) throw new NotFoundError("Shopping list item doesn't exists");

  return checkShoppingListItem;
};

/**
 * Update shopping list item
 * @param {String} shoppingListId
 * @param {String} itemId
 * @param {Object} data
 * @returns Boolean
 */
const updateShoppingListItem = async (shoppingListId, itemId, data) => {
  const checkShoppingListItem = await ShoppingListItem.findOne({ _id: itemId, shoppingListId }).lean();
  if (!checkShoppingListItem) throw new NotFoundError("Shopping list item doesn't exists");

  const filter = { _id: itemId, shoppingListId };
  const update = data;
  const opts = { new: true };

  const shoppingListItem = await ShoppingListItem.findOneAndUpdate(filter, update, opts);

  if (shoppingListItem) return true;
  else return false;
};

/**
 * Delete multiple items from shopping list by id
 * @param {String} shoppingListId
 * @param {Array[String]} data
 * @returns Boolean
 */
const deleteShoppingListItems = async (shoppingListId, data) => {
  const shoppingLists = await ShoppingListItem.find({ _id: { $in: data.ids } }).lean();
  if (shoppingLists.length === 0) throw new NotFoundError("Shopping List doesn't exists");

  const response = await ShoppingListItem.deleteMany({ _id: { $in: data.ids } });

  if (response) {
    shoppingLists.map(async (list) => {
      await ShoppingList.findOneAndUpdate(
        { _id: shoppingListId },
        {
          $pull: { shoppingListItems: list._id },
        },
      );
    });

    return true;
  } else return false;
};

module.exports = {
  createShoppingListItems,
  allShoppingListItems,
  getShoppingListItem,
  updateShoppingListItem,
  deleteShoppingListItems,
};
