const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'PackageCategory', required: true },
  locations: [{ type: String }],
  price: {
    original: { type: Number, required: true },
    current: { type: Number, required: true },
    label: { type: String, default: "onwards" }
  },
  isRecommended: { type: Boolean, default: false },
  image: { type: String, required: true },
  days: { type: Number, required: true },
  nights: { type: Number, required: true },
  durationLabel: { type: String },
  tripBreakdown: { type: String },
  startLocation: { type: String },
  departureDates: [{ type: String }],
  features: [{ type: String }],
  itinerary: { type: String },
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  terms: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["Active", "Draft"], default: "Draft" }
});

module.exports = mongoose.model('Package', PackageSchema);
