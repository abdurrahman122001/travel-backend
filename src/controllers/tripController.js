const Trip = require("../models/Trip");
const TripCategory = require("../models/TripCategory");

exports.createTrip = async (req, res) => {
  try {
    console.log("Received trip data:", req.body); // Debug log

    // Validate required fields
    if (!req.body.title || !req.body.title.trim()) {
      return res.status(400).json({ error: "Trip title is required" });
    }

    if (!req.body.category) {
      return res.status(400).json({ error: "Category is required" });
    }

    // Verify category exists
    const categoryExists = await TripCategory.findById(req.body.category);
    if (!categoryExists) {
      return res.status(400).json({ error: "Invalid category" });
    }

    // Build trip data object - ONLY include fields that are provided
    const tripData = {
      title: req.body.title.trim(),
      category: req.body.category
    };

    // Handle status - ensure it's a valid enum value
    if (req.body.status && ["Active", "Upcoming", "Completed", "Cancelled"].includes(req.body.status)) {
      tripData.status = req.body.status;
    }

    // Handle optional fields - only add if they exist
    if (req.body.destination !== undefined) {
      tripData.destination = req.body.destination?.trim() || "";
    }

    if (req.body.description !== undefined) {
      tripData.description = req.body.description?.trim() || "";
    }

    if (req.body.startDate) {
      tripData.startDate = req.body.startDate;
    }

    if (req.body.endDate) {
      tripData.endDate = req.body.endDate;
    }

    if (req.body.price !== undefined) {
      tripData.price = Number(req.body.price) || 0;
    }

    if (req.body.maxGuests !== undefined) {
      tripData.maxGuests = Number(req.body.maxGuests) || 0;
    }

    if (req.body.image !== undefined) {
      tripData.image = req.body.image || "";
    }

    console.log("Final trip data being saved:", tripData);

    const trip = await Trip.create(tripData);
    
    // Populate category for response
    await trip.populate("category");
    
    res.status(201).json(trip);
  } catch (err) {
    console.error("Error creating trip:", err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({ error: "Trip with this title already exists" });
    }
    
    res.status(500).json({ error: "Internal server error" });
  }
};


// Read All Trips
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate("category").sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    console.error("Error fetching trips:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Read One Trip
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("category");
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    console.error("Error fetching trip:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update Trip
exports.updateTrip = async (req, res) => {
  try {
    // Only validate required fields if they are being updated
    if (req.body.title !== undefined && !req.body.title.trim()) {
      return res.status(400).json({ error: "Trip title cannot be empty" });
    }

    if (req.body.category !== undefined) {
      const categoryExists = await TripCategory.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({ error: "Invalid category" });
      }
    }

    // Build update object with only provided fields
    const updateData = {};
    
    if (req.body.title !== undefined) updateData.title = req.body.title.trim();
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.destination !== undefined) updateData.destination = req.body.destination?.trim() || "";
    if (req.body.description !== undefined) updateData.description = req.body.description?.trim() || "";
    if (req.body.startDate !== undefined) updateData.startDate = req.body.startDate || null;
    if (req.body.endDate !== undefined) updateData.endDate = req.body.endDate || null;
    if (req.body.price !== undefined) updateData.price = Number(req.body.price) || 0;
    if (req.body.maxGuests !== undefined) updateData.maxGuests = Number(req.body.maxGuests) || 0;
    if (req.body.image !== undefined) updateData.image = req.body.image || "";

    console.log("Updating trip with data:", updateData);

    const trip = await Trip.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate("category");
    
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    console.error("Error updating trip:", err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: "Internal server error" });
  }
};
// Delete Trip
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json({ success: true, message: "Trip deleted successfully" });
  } catch (err) {
    console.error("Error deleting trip:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get trips by category name
exports.getTripsByCategoryName = async (req, res) => {
  try {
    const category = await TripCategory.findOne({ name: req.params.categoryName });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    const trips = await Trip.find({ category: category._id }).populate("category");
    res.json(trips);
  } catch (err) {
    console.error("Error fetching trips by category:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get International Trips
exports.getInternationalTrips = async (req, res) => {
  try {
    const category = await TripCategory.findOne({ name: "International Trips" });
    if (!category) {
      return res.status(404).json({ error: "Category 'International Trips' not found" });
    }
    const trips = await Trip.find({ category: category._id }).populate("category");
    res.json(trips);
  } catch (err) {
    console.error("Error in getInternationalTrips:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Explore India Trips
exports.getExploreIndiaTrips = async (req, res) => {
  try {
    const category = await TripCategory.findOne({ name: "Explore India" });
    if (!category) {
      return res.status(404).json({ error: "Category 'Explore India' not found" });
    }
    const trips = await Trip.find({ category: category._id }).populate("category");
    res.json(trips);
  } catch (err) {
    console.error("Error in getExploreIndiaTrips:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Romantic Escapes Trips
exports.getRomanticEscapesTrips = async (req, res) => {
  try {
    const category = await TripCategory.findOne({ name: "Romantic Escapes" });
    if (!category) {
      return res.status(404).json({ error: "Category 'Romantic Escapes' not found" });
    }
    const trips = await Trip.find({ category: category._id }).populate("category");
    res.json(trips);
  } catch (err) {
    console.error("Error in getRomanticEscapesTrips:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Count All Trips
exports.countAllTrips = async (req, res) => {
  try {
    const count = await Trip.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Error counting trips:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};