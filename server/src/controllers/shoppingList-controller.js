'use strict';

const ShoppingList = require('../models/shoppingList-model');
const User = require('../models/user-model');

const { ConflictError, NotFoundError, NoContentError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Create new shopping list
 * @param {Object} data
 * @param {String} userId
 * @returns Boolean
 */
const createShoppingList = async (data, userId) => {
  const shoppingListExists = await ShoppingList.exists({ name: data.name });
  if (shoppingListExists) throw new ConflictError('Shopping List exists');

  const checkUser = await User.findOne({ _id: userId }).lean();
  if (!checkUser) throw new NotFoundError("User doesn't exists");

  const allowedUsers = await User.find({ _id: { $in: data.allowedUsers } }).lean();
  if (allowedUsers.length === 0) throw new NotFoundError("Contributors doesn't exists");

  data.userId = userId;

  const shoppingList = new ShoppingList(data);

  return await shoppingList
    .save()
    .then(async () => {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: { shoppingLists: shoppingList },
        },
      );
      return true;
    })
    .catch((error) => {
      logger.error(error);
      return false;
    });
};

/**
 * Add allowed user to shopping list
 * @param {Object} data
 * @param {String} shoppingListId
 * @returns Boolean
 */
const addUserToShoppingList = async (data, shoppingListId) => {
  const shoppingListExists = await ShoppingList.exists({ _id: shoppingListId });
  if (!shoppingListExists) throw new ConflictError('Shopping no exists');

  const checkUser = await User.findOne({ _id: data.userId }).lean();
  if (!checkUser) throw new NotFoundError("User doesn't exists");

  const response = await ShoppingList.findOneAndUpdate(
    { _id: shoppingListId },
    {
      $push: { allowedUsers: data.userId },
    },
  );

  if (response) return true;
  else return false;
};

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

    shoppingLists = await ShoppingList.find({ userId })
      .populate({ path: 'shoppingListItems' })
      .populate({ path: 'allowedUsers' })
      .lean();
  } else
    shoppingLists = await ShoppingList.find()
      .populate({ path: 'shoppingListItems' })
      .populate({ path: 'allowedUsers' })
      .lean();

  if (shoppingLists.length === 0) throw new NoContentError('No shopping lists');
  return shoppingLists;
};

/**
 * Get one shopping list
 * @param {String} shoppingListId
 * @returns Object
 */
const getShoppingList = async (shoppingListId) => {
  const shoppingList = await ShoppingList.findOne({ _id: shoppingListId })
    .populate({ path: 'shoppingListItems' })
    .populate({ path: 'allowedUsers' })
    .lean();

  if (!shoppingList) throw new NotFoundError("Shopping List doesn't exists");

  return shoppingList;
};

/**
 * Update one shopping list
 * @param {String} shoppingListId
 * @param {Object} data
 * @returns Boolean
 */
const updateShoppingList = async (shoppingListId, data) => {
  const checkShoppingList = await ShoppingList.findOne({ _id: shoppingListId }).lean();
  if (!checkShoppingList) throw new NotFoundError("Shopping list doesn't exists");

  const allowedUsers = await User.find({ _id: { $in: data.allowedUsers } }).lean();
  if (allowedUsers.length === 0) throw new NotFoundError("Contributors doesn't exists");

  const filter = { _id: shoppingListId };
  const update = data;
  const opts = { new: true };

  const shoppingList = await ShoppingList.findOneAndUpdate(filter, update, opts);

  if (shoppingList) return true;
  else return false;
};

/**
 * Remove allowed user from shopping list
 * @param {String} shoppingListId
 * @param {Object} data
 * @returns
 */
const deleteAllowedUsers = async (shoppingListId, data) => {
  const checkShoppingList = await ShoppingList.findOne({ _id: shoppingListId }).lean();
  if (!checkShoppingList) throw new NotFoundError("Shopping list doesn't exists");

  const response = await ShoppingList.findOneAndUpdate(
    { _id: shoppingListId },
    {
      $pull: { allowedUsers: data.allowedUserId },
    },
  );

  if (response) return true;
  else return false;
};

/**
 * Delete one shopping list
 * @param {String} shoppingListId
 * @returns Boolean
 */
const deleteShoppingList = async (shoppingListId) => {
  const shoppingList = await ShoppingList.findOne({ _id: shoppingListId }).lean();
  if (!shoppingList) throw new NotFoundError("Shopping List doesn't exists");

  const response = await ShoppingList.deleteOne({ _id: shoppingListId });

  if (response) {
    await User.findOneAndUpdate(
      { _id: shoppingList.userId },
      {
        $pull: { shoppingLists: shoppingListId },
      },
    );

    return true;
  } else return false;
};

module.exports = {
  createShoppingList,
  addUserToShoppingList,
  allShoppingLists,
  getShoppingList,
  updateShoppingList,
  deleteAllowedUsers,
  deleteShoppingList,
};
