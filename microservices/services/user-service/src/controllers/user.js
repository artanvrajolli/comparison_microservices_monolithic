const { User } = require('../models');
const promClient = require('prom-client');


// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.status(200).json(users);
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    
    if (!user) {
      
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    
    res.status(200).json(user);
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    
    res.status(201).json(user);
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    
    res.status(200).json(user);
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      
      return res.status(404).json({
        success: false,
        error: 'User not found'
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