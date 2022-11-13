'use strict';

const ShoppingList = require('../models/shoppingList-model');
const User = require('../models/user-model');
const { getRole } = require('./role-controller');

const { ConflictError, NotFoundError, ForbiddenError, NoContentError, NotAuthorizedError } = require('../utils/errors');
const { ROLE } = require('../utils/constants');
const logger = require('../utils/logger');

const createShoppingList = async (data, userId) => {
  const shoppingListExists = await ShoppingList.exists({ name: data.name });
  if (shoppingListExists) throw new ConflictError('Shopping List exists');

  const checkUser = await User.findOne({ _id: userId }).lean();
  if (!checkUser) throw new NotFoundError("User doesn't exists");

  data.userId = userId;
  const shoppingList = new ShoppingList(data);

  return await shoppingList
    .save()
    .then(async () => {
      return true;
    })
    .catch((error) => {
      logger.error(error);
      return false;
    });
};

// /**
//  * Get all users can only admin
//  * @returns {Array[Object]} users
//  */
// const allUsers = async () => {
//   const users = await User.find().populate({ path: 'role' }).lean();

//   if (users.length === 0) throw new NoContentError('No users');
//   return users;
// };

// /**
//  * Get one user depends on id
//  * @param {String} userId
//  * @returns {Object } user
//  */
// const getUser = async (userId) => {
//   const user = await User.findOne({ _id: userId })
//     .lean()
//     .populate([{ path: 'role' }]);

//   if (!user) throw new NotFoundError("User doesn't exists");

//   return user;
// };

// /**
//  * Update user, only admins or same user can do that
//  * @param {String} userId
//  * @param {Object} data
//  * @param {Boolean} isAdmin
//  * @returns Boolean
//  */
// const updateUser = async (userId, data, isAdmin) => {
//   const checkUser = await User.findOne({ _id: userId }).lean();
//   if (!checkUser) throw new NotFoundError("User doesn't exists");

//   let newData;

//   // Update role if admin
//   if (isAdmin && data?.roleId) {
//     const role = await getRole(data.roleId, undefined);

//     delete data.role;

//     newData = {
//       ...data,
//       roleId: role._id,
//     };
//   } else if (isAdmin === undefined && data?.roleId) throw new NotAuthorizedError();
//   else {
//     newData = data;
//   }

//   const filter = { _id: userId };
//   const update = newData;
//   const opts = { new: true };

//   const user = await User.findOneAndUpdate(filter, update, opts);

//   if (user) return true;
//   else return false;
// };

// /**
//  * Only admins can delete user
//  * @param {String} userId
//  * @returns Boolean
//  */
// const deleteUser = async (userId) => {
//   const user = await User.findOne({ _id: userId }).lean();
//   if (!user) throw new NotFoundError("User doesn't exists");

//   const response = await User.deleteOne({ email: user.email });
//   if (response) return true;
//   else return false;
// };

module.exports = { createShoppingList };
