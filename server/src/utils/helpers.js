'use strict';

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



module.exports = {
  arrayObjectUnique,
  dashToCamelCase
};
