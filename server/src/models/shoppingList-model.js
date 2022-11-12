'use strict';

const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
      minlength: 4,
      trim: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'userId',
      select: true,
    },
  },
  { timestamps: true },
);

shoppingListSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

shoppingListSchema.virtual('user', {
  ref: 'UserShoppingList',
  localField: '_id',
  foreignField: 'userId',
});

shoppingListSchema.set('toObject', {
  virtuals: true,
});
shoppingListSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema, 'shoppingList');
