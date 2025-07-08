// controllers/commentController.js
const Comment = require('../models/Comment');

// Get comments for a blog (by blog slug or blog ID)
exports.getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await Comment.find({ blog: blogId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a comment to a blog
exports.addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { name, comment } = req.body;
    if (!name || !comment) {
      return res.status(400).json({ error: "Name and comment are required." });
    }
    const newComment = new Comment({ blog: blogId, name, comment });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
