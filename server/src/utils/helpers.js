'use strict';

const mongoose = require('mongoose');

/**
 * Remove all duplicates values from Array of objects
 * @param {Array[Objects]} arr
 * @param {String} key
 * @returns Array[Objects]
 */
const arrayObjectUnique = (arr, key) => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};

/**
 * Convert Dash string into CamelCase
 * @param {String} string
 * @returns String
 */
const dashToCamelCase = (string) => {
  return string.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
};

/**
 * Check if MongoId ObjectId is valid
 * @param {String} value
 * @returns Boolean
 */
const isValidMongoId = (value) => {
  const isValid = mongoose.isValidObjectId(value);
  if (!isValid) return false;
  return true;
};

module.exports = {
  arrayObjectUnique,
  dashToCamelCase,
  isValidMongoId,
};
