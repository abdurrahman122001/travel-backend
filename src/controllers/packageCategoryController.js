const PackageCategory = require('../models/PackageCategory');
const PackageSubcategory = require('../models/PackageSubcategory');

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
exports.getCategoriesWithSubcategories = async (req, res) => {
  try {
    // Get all categories
    const categories = await PackageCategory.find().lean();
    // Get all subcategories
    const subcategories = await PackageSubcategory.find().lean();

    // Group subcategories by their category
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat._id.toString()] = { ...cat, subcategories: [] };
    });
    subcategories.forEach(sub => {
      const catId = sub.category.toString();
      if (categoryMap[catId]) {
        categoryMap[catId].subcategories.push(sub);
      }
    });

    // Return as array
    res.json(Object.values(categoryMap));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
