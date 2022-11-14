'use strict';

const ShoppingList = require('../models/shoppingList-model');
const User = require('../models/user-model');

const { ConflictError, NotFoundError, NoContentError } = require('../utils/errors');
const logger = require('../utils/logger');


const createAllowUsers = async (data) => {
  console.log('DATA -----------', data);
  // const shoppingListExists = await ShoppingList.exists({ name: data.name });
  // if (shoppingListExists) throw new ConflictError('Shopping List exists');

  // const checkUser = await User.findOne({ _id: userId }).lean();
  // if (!checkUser) throw new NotFoundError("User doesn't exists");

  // data.userId = userId;
  // const shoppingList = new ShoppingList(data);

  // return await shoppingList
  //   .save()
  //   .then(async () => {
  //     await User.findOneAndUpdate(
  //       { _id: userId },
  //       {
  //         $push: { shoppingLists: shoppingList },
  //       },
  //     );
  //     return true;
  //   })
  //   .catch((error) => {
  //     logger.error(error);
  //     return false;
  //   });
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

    shoppingLists = await ShoppingList.find({ userId }).populate({ path: 'shoppingListItems' }).lean();
  } else shoppingLists = await ShoppingList.find().populate({ path: 'shoppingListItems' }).lean();

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
  const shoppingList = await ShoppingList.findOne({ _id: shoppingListId, userId })
    .populate({ path: 'shoppingListItems' })
    .lean();

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

  if (response) {
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { shoppingLists: shoppingListId },
      },
    );

    return true;
  } else return false;
};

module.exports = { createAllowUsers };
