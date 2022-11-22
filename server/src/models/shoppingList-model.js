'use strict';

const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
      minlength: 2,
      trim: true,
      unique: false,
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
    allowedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

shoppingListSchema.set('toObject', {
  virtuals: true,
});
shoppingListSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema, 'shoppingList');
