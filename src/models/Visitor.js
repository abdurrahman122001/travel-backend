const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  page: { type: String, required: true },
  country: { type: String },
  city: { type: String },
  device: { type: String, required: true },
  browser: { type: String, required: true },
  visitedAt: { type: Date, default: Date.now },
  sessionDuration: { type: Number },
});

module.exports = mongoose.model("Visitor", VisitorSchema);
