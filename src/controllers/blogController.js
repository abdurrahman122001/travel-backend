const Blog = require('../models/Blog');

// Utility function to parse tags (string or array)
function parseTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    return tags.split(',').map(tag => tag.trim()).filter(Boolean);
  }
  return [];
}

// CREATE a new blog post
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,   // <-- HTML string from ReactQuill
      category,
      tags,
      author,
      image,
      status,
      featured
    } = req.body;

    const tagsArray = parseTags(tags);

    const blog = new Blog({
      title,
      slug,
      excerpt,
      content,
      category,
      tags: tagsArray,
      author,
      image,
      status,
      featured: featured || false,
      publishedAt: status === "Published" ? new Date() : null,
    });

    await blog.save();
    res.status(201).json({ message: 'Blog post created!', blog });
  } catch (error) {
    let msg = error.message;
    if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
      msg = "Slug must be unique. Please choose a different slug.";
    }
    res.status(500).json({ error: 'Failed to create blog', details: msg });
  }
};

// GET all published blogs ONLY
exports.getAllBlogs = async (req, res) => {
  try {
    // Only fetch blogs where status is Published
    const blogs = await Blog.find({ status: "Published" }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs', details: error.message });
  }
};

// GET a published blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, status: "Published" });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog', details: error.message });
  }
};

// GET a published blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: "Published" });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog', details: error.message });
  }
};

// UPDATE a blog (no change needed for status filter here, since you update all blogs)
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      author,
      image,
      status,
      featured
    } = req.body;

    const tagsArray = parseTags(tags);

    // Check category matches enum
    const allowedCategories = ['Travel Tips', 'Destinations', 'Culture', 'Adventure', 'Food'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        error: "Invalid category",
        details: `Category must be one of: ${allowedCategories.join(", ")}`
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        excerpt,
        content,
        category,
        tags: tagsArray,
        author,
        image,
        status,
        featured: featured || false,
        publishedAt: status === "Published" ? new Date() : null,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBlog)
      return res.status(404).json({ error: 'Blog not found' });

    res.json({ message: 'Blog updated', blog: updatedBlog });
  } catch (error) {
    let msg = error.message;
    if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
      msg = "Slug must be unique. Please choose a different slug.";
    }
    res.status(500).json({ error: 'Failed to update blog', details: msg });
  }
};

// DELETE a blog (no change needed)
exports.deleteBlog = async (req, res) => {
  try {
    const result = await Blog.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog', details: error.message });
  }
};

// GET count of only published blogs
exports.countAllBlogs = async (req, res) => {
  try {
    const count = await Blog.countDocuments({ status: "Published" });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to count blogs', details: error.message });
  }
};
