const mongoose = require("mongoose");

const TripCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true }, // optional, good for URLs
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TripCategory", TripCategorySchema);
