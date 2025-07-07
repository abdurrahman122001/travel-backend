const Category = require('../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    // Generate a simple slug (e.g., "Travel Tips" -> "travel-tips")
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const category = new Category({ name, description, slug });
    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(500).json({ error: "Failed to create category", details: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories", details: error.message });
  }
};

// Delete a category (by id)
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category", details: error.message });
  }
};
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    // If name is updated, regenerate slug
    let updateFields = { description };
    if (name) {
      updateFields.name = name;
      updateFields.slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Category not found" });

    res.json({ message: "Category updated", category: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update category", details: error.message });
  }
};