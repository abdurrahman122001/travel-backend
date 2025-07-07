// controllers/tripController.js
const Trip = require("../models/Trip");
const TripCategory = require("../models/TripCategory"); // <-- THIS IS MISSING

const getTripsByCategoryName = async (categoryName) => {
  const category = await TripCategory.findOne({ name: categoryName });
  if (!category) {
    console.log("Category not found:", categoryName);
    return [];
  }
  return Trip.find({ category: category._id });
};
// Create Trip
exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    // Populate category for response
    await trip.populate("category");
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read All Trips
exports.getAllTrips = async (req, res) => {
  try {
    // Populate category details
    const trips = await Trip.find().populate("category");
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read One Trip
exports.getTripById = async (req, res) => {
  try {
    // Populate category details
    const trip = await Trip.findById(req.params.id).populate("category");
    if (!trip) return res.status(404).json({ error: "Not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Trip
exports.updateTrip = async (req, res) => {
  try {
    // { new: true } returns the updated document
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("category");
    if (!trip) return res.status(404).json({ error: "Not found" });
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Trip
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getInternationalTrips = async (req, res) => {
  try {
    const category = await TripCategory.findOne({ name: "International Trips" });
    if (!category) {
      console.log("Category 'International Trips' not found");
      return res.status(404).json({ error: "Category not found" });
    }
    const trips = await Trip.find({ category: category._id });
    res.json(trips);
  } catch (err) {
    console.error("Error in getInternationalTrips:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getExploreIndiaTrips = async (req, res) => {
  try {
    const category = await TripCategory.findOne({ name: "Explore India" });
    if (!category) {
      console.log("Category 'Explore India' not found");
      return res.status(404).json({ error: "Category not found" });
    }
    const trips = await Trip.find({ category: category._id });
    res.json(trips);
  } catch (err) {
    console.error("Error in getExploreIndiaTrips:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getRomanticEscapesTrips = async (req, res) => {
  try {
    const category = await TripCategory.findOne({ name: "Romantic Escapes" });
    if (!category) {
      console.log("Category 'Explore India' not found");
      return res.status(404).json({ error: "Category not found" });
    }
    const trips = await Trip.find({ category: category._id });
    res.json(trips);
  } catch (err) {
    console.error("Error in getExploreIndiaTrips:", err);
    res.status(500).json({ error: err.message });
  }
};