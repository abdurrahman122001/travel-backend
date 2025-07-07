const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // You could add 'icon' or 'color' fields for UI display
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);
