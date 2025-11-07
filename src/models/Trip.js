const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Trip title is required"],
    trim: true
  },
  destination: {
    type: String,
    trim: true,
    default: ""
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  maxGuests: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ["Active", "Upcoming", "Completed", "Cancelled"],
    default: "Upcoming"
  },
  image: {
    type: String,
    default: ""
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TripCategory",
    required: [true, "Category is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for better performance
TripSchema.index({ category: 1 });
TripSchema.index({ status: 1 });

module.exports = mongoose.model("Trip", TripSchema);