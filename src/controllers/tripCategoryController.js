const TripCategory = require("../models/TripCategory");

// Create category
exports.createCategory = async (req, res) => {
  try {
    const cat = await TripCategory.create(req.body);
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const cats = await TripCategory.find();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one category
exports.getCategory = async (req, res) => {
  try {
    const cat = await TripCategory.findById(req.params.id);
    if (!cat) return res.status(404).json({ error: "Not found" });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const cat = await TripCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ error: "Not found" });
    res.json(cat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const cat = await TripCategory.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
