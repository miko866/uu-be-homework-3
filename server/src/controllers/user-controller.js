'use strict';

const User = require('../models/user-model');
const ShoppingList = require('../models/shoppingList-model');
const ShoppingListItem = require('../models/shoppingListItem-model');

const { getRole } = require('./role-controller');

const { ConflictError, NotFoundError, ForbiddenError, NoContentError, NotAuthorizedError } = require('../utils/errors');
const { ROLE } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Register a new user. It is a public endpoint without Auth.
 * @param {Object} data
 * @returns Boolean
 */
const registerUser = async (data) => {
  const userExists = await User.exists({ email: data.email });
  if (userExists) {
    throw new ConflictError('User exists');
  }

  const role = await getRole(undefined, ROLE.user);
  data.roleId = role._id;

  const user = new User(data);

  return await user
    .save()
    .then(async () => {
      return true;
    })
    .catch((error) => {
      logger.error(error);
      return false;
    });
};

/**
 * Only admins can create a new user.
 * @param {Object} data
 * @returns {Boolean}
 */
const createUser = async (data) => {
  const userExists = await User.exists({ email: data.email });
  if (userExists) {
    throw new ConflictError('User exists');
  }

  const checkRole = await getRole(data.roleId, undefined);
  if (!checkRole) {
    throw new NotFoundError("Role doesn't exists");
  }

  const user = new User(data);

  return await user
    .save()
    .then(async () => {
      return true;
    })
    .catch((error) => {
      logger.error(error);
      return false;
    });
};

/**
 * Get all users can only admin
 * @returns {Array[Object]} users
 */
const allUsers = async () => {
  const users = await User.find().populate({ path: 'role' }).populate({ path: 'shoppingLists' }).lean();

  if (users.length === 0) throw new NoContentError('No users');
  return users;
};

/**
 * Get one user depends on id
 * @param {String} userId
 * @returns {Object } user
 */
const getUser = async (userId) => {
  const user = await User.findOne({ _id: userId })
    .lean()
    .populate([{ path: 'role' }])
    .populate({ path: 'shoppingLists' });

  if (!user) throw new NotFoundError("User doesn't exists");

  return user;
};

/**
 * Update user, only admins or same user can do that
 * @param {String} userId
 * @param {Object} data
 * @param {Boolean} isAdmin
 * @returns Boolean
 */
const updateUser = async (userId, data, isAdmin) => {
  const checkUser = await User.findOne({ _id: userId }).lean();
  if (!checkUser) throw new NotFoundError("User doesn't exists");

  let newData;

  // Update role if admin
  if (isAdmin && data?.roleId) {
    const role = await getRole(data.roleId, undefined);

    delete data.role;

    newData = {
      ...data,
      roleId: role._id,
    };
  } else if (isAdmin === undefined && data?.roleId) throw new NotAuthorizedError();
  else {
    newData = data;
  }

  const filter = { _id: userId };
  const update = newData;
  const opts = { new: true };

  const user = await User.findOneAndUpdate(filter, update, opts);

  if (user) return true;
  else return false;
};

/**
 * Only admins can delete user
 * @param {String} userId
 * @returns Boolean
 */
const deleteUser = async (userId) => {
  const user = await User.findOne({ _id: userId }).lean();
  if (!user) throw new NotFoundError("User doesn't exists");

  const response = await User.deleteOne({ email: user.email });

  // DELETE_CASCADE
  if (response) {
    const shoppingLists =  await ShoppingList.find({ userId }).lean()

    shoppingLists?.map(async list => {
      await ShoppingList.deleteOne({ _id: list._id });

      list.shoppingListItems?.map(async item => {
        await ShoppingListItem.deleteMany({ _id: { $in: item } });
      })
    })

    user?.shoppingLists.map(async (list) => {
      await ShoppingList.findOneAndUpdate(
        { _id: list.toString() },
        {
          $pull: { allowedUsers: userId },
        },
      );
    });

    return true;
  } else return false;
};;

module.exports = { registerUser, createUser, allUsers, getUser, updateUser, deleteUser };
