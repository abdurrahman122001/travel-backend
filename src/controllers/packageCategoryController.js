const fs = require('fs');
const path = require('path');
const PackageCategory = require('../models/PackageCategory');
const PackageSubcategory = require('../models/PackageSubcategory'); // You missed this import earlier
const upload = require('../config/multerConfig');

// Middleware to handle single file upload
exports.uploadImage = upload.single('image');

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const categoryData = { name, description };

    if (req.file) {
      categoryData.imagePath = `/uploads/categories/${req.file.filename}`;
    }

    const cat = await PackageCategory.create(categoryData);
    res.status(201).json(cat);
  } catch (err) {
    // Remove uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, '../public', req.file.path));
    }
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

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await PackageCategory.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updateData = { name, description };

    // If new image uploaded
    if (req.file) {
      // Delete old image if exists
      if (category.imagePath) {
        const oldImagePath = path.join(__dirname, '../public', category.imagePath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.imagePath = `/uploads/categories/${req.file.filename}`;
    }

    const updated = await PackageCategory.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });
    
    res.json(updated);
  } catch (err) {
    // Remove uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, '../public', req.file.path));
    }
    res.status(400).json({ error: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await PackageCategory.findById(id);
    
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Delete associated image if exists
    if (category.imagePath) {
      const imagePath = path.join(__dirname, '../public', category.imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // FIX: use deleteOne instead of remove
    await category.deleteOne();
    res.json({ success: true, id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get categories with subcategories
exports.getCategoriesWithSubcategories = async (req, res) => {
  try {
    const categories = await PackageCategory.find().lean();
    const subcategories = await PackageSubcategory.find().lean();

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

    res.json(Object.values(categoryMap));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
