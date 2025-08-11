const mongoose = require('mongoose');

const PackageCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  imagePath: { type: String }, // Stores the path to the image file
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PackageCategory', PackageCategorySchema);