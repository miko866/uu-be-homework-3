'use strict';

const mongoose = require('mongoose');

const shoppingListItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
      minlength: 4,
      trim: true,
      unique: false,
    },
    status: {
      type: Boolean,
      required: true,
    },
    shoppingListId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'shoppingListId',
      select: true,
    },
  },
  { timestamps: true },
);

shoppingListItemSchema.virtual('shoppingList', {
  ref: 'ShoppingList',
  localField: 'shoppingListId',
  foreignField: '_id',
  justOne: true,
});

shoppingListItemSchema.set('toObject', {
  virtuals: true,
});
shoppingListItemSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('ShoppingListItem', shoppingListItemSchema, 'shoppingListItem');
