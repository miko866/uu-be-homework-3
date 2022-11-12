'use strict';

const Role = require('../models/role-model');

const { NotFoundError, NoContentError } = require('../utils/errors');

/**
 * Get one role depends on name or id
 * @param {String} id
 * @param {String} name
 * @returns {Object } role
 */
const getRole = async (id = undefined, name = undefined) => {
  let role = null;
  if (name) role = await Role.findOne({ name }).lean();
  else role = await Role.findById(id).lean();

  if (!role) throw new NotFoundError("Role doesn't exists");
  return role;
};

/**
 * Admins can take all roles
 * @returns {Array[Object]} Roles
 */
const getRoles = async () => {
  const roles = await Role.find().lean();

  if (roles.length === 0) throw new NoContentError('No roles');
  return roles;
};

module.exports = { getRole, getRoles };
