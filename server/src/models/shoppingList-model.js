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
    shoppingListItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShoppingListItem',
      },
    ],
  },
  { timestamps: true },
);

shoppingListSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

shoppingListSchema.virtual('users', {
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
