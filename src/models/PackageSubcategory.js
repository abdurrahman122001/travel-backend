const mongoose = require('mongoose');

const PackageSubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'PackageCategory', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PackageSubcategory', PackageSubcategorySchema);
