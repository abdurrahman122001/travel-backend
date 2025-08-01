const Package = require('../models/Package');
const PackageCategory = require('../models/PackageCategory');
const slugify = require('slugify');

// Create new package
exports.createPackage = async (req, res) => {
  try {
    if (!req.body.slug && req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }
    // Accept subcategory from body (category must still be required!)
    const pkg = await Package.create(req.body);
    res.status(201).json(pkg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all packages
exports.getPackages = async (req, res) => {
  try {
    const pkgs = await Package.find()
      .populate('categories')
      .populate('subcategories'); // <-- ADD THIS
    res.json(pkgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get one package by ID
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id)
      .populate('categories')
      .populate('subcategories');
    if (!pkg) return res.status(404).json({ error: 'Not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get package by slug
exports.getPackageBySlug = async (req, res) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug })
      .populate('categories')
      .populate('subcategories'); // <-- ADD THIS
    if (!pkg) return res.status(404).json({ error: 'Not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update package
exports.updatePackage = async (req, res) => {
  try {
    if (req.body.title && !req.body.slug) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pkg) return res.status(404).json({ error: 'Not found' });
    res.json(pkg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Delete a package by ID
exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, message: "Package deleted successfully." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBestSellingCommunityTrips = async (req, res) => {
  try {
    const category = await PackageCategory.findOne({ name: "International Trips" });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const packages = await Package.find({ categories: category._id, status: "Active" })
      .populate("categories")
      .sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getSummerDeals = async (req, res) => {
  try {
    const category = await PackageCategory.findOne({ name: "Indian Trips" });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const packages = await Package.find({ categories: category._id, status: "Active" })
      .populate("categories")
      .sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAfforadablePackage = async (req, res) => {
  try {
    const category = await PackageCategory.findOne({ name: "School Trips" });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const packages = await Package.find({ categories: category._id, status: "Active" })
      .populate("categories")
      .sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEuropeWithUk = async (req, res) => {
  try {
    const category = await PackageCategory.findOne({ name: "Inschool Camps" });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const packages = await Package.find({ categories: category._id, status: "Active" })
      .populate("categories")
      .sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.countAllPackages = async (req, res) => {
  try {
    const count = await Package.countDocuments();
    console.log("Package count:", count); // debug
    res.json({ count });
  } catch (err) {
    console.error("Count error:", err);   // log the error!
    res.status(500).json({ error: err.message });
  }
};
exports.getPackagesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Make sure categoryId is valid
    if (!categoryId) return res.status(400).json({ error: "Category ID is required" });

    // Find packages where categories array includes this categoryId
    const packages = await Package.find({ categories: categoryId })
      .populate('categories')
      .populate('subcategories');
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLatestPackages = async (req, res) => {
  try {
    const latestPackages = await Package.find()
      .sort({ createdAt: -1 })
      .populate('categories')
      .populate('subcategories');
    res.json(latestPackages);
  } catch (err) {
    console.error("Error in getLatestPackages:", err); // <---- Add this
    res.status(500).json({ error: err.message });
  }
};
