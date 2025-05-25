const axios = require('axios');
const { Blog } = require('../models');
const promClient = require('prom-client');


// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().lean();
    
    res.status(200).json(blogs);
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).lean();
    
    if (!blog) {
      
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }
    
    
    res.status(200).json(blog);
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new blog
exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    
    res.status(201).json(blog);
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }
    
    
    res.status(200).json(blog);
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }
    
    
    res.status(200).json({ success: true });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 