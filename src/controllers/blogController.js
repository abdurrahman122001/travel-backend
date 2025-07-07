const Blog = require('../models/Blog');

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, author, image, status, featured } = req.body;
    const tagsArray = typeof tags === 'string'
      ? tags.split(',').map(tag => tag.trim())
      : Array.isArray(tags)
        ? tags
        : [];

    const blog = new Blog({
      title,
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
    res.status(500).json({ error: 'Failed to create blog', details: error.message });
  }
};

// Get all blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs', details: error.message });
  }
};

// Get a single blog post by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog', details: error.message });
  }
};

// (Optional) Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    const result = await Blog.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog', details: error.message });
  }
};
// Update a blog post
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      author,
      image,
      status,
      featured
    } = req.body;

    // Ensure tags is always an array
    const tagsArray = typeof tags === 'string'
      ? tags.split(',').map(tag => tag.trim())
      : Array.isArray(tags)
        ? tags
        : [];

    // Find blog by ID and update
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
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
    res.status(500).json({ error: 'Failed to update blog', details: error.message });
  }
};
