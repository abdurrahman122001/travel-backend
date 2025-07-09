const PackageSubcategory = require('../models/PackageSubcategory');

// Create new subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const subcat = await PackageSubcategory.create(req.body);
    res.status(201).json(subcat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all subcategories (optional: filter by category)
exports.getSubcategories = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const subcats = await PackageSubcategory.find(filter).populate('category', 'name');
    res.json(subcats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await PackageSubcategory.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: "Subcategory not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PackageSubcategory.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Subcategory not found" });
    res.json({ success: true, id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
