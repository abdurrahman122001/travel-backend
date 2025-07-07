const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  price: { type: Number, required: true },
  maxGuests: { type: Number, required: true },
  status: { type: String, enum: ["Active", "Draft", "Cancelled"], default: "Draft" },
  image: { type: String }, // Store image as base64 or URL
  category: { type: mongoose.Schema.Types.ObjectId, ref: "TripCategory", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Trip", TripSchema);
