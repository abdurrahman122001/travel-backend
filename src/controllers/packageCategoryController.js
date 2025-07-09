const PackageCategory = require('../models/PackageCategory');

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const cat = await PackageCategory.create(req.body);
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const cats = await PackageCategory.find();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await PackageCategory.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: "Category not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PackageCategory.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.json({ success: true, id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};