'use strict';

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 16,
      minlength: 4,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Role', roleSchema, 'role');
