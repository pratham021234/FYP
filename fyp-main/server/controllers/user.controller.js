const User = require('../models/User.model');
const { generateToken } = require('../utils/jwt.utils');

// Create user (coordinator/admin only) — for creating guide/coordinator accounts
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, department, phone } = req.body;

    if (!['guide', 'coordinator'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'This endpoint is for creating guide or coordinator accounts only'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password: password || 'Temp@1234',
      role,
      department,
      phone
    });

    // Don't expose password in response
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`,
      data: user
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create user'
    });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const { role, department, year, page = 1, limit = 10, search } = req.query;
    
    const query = { isActive: true };
    if (role) query.role = role;
    if (department) query.department = department;
    if (year) query.year = parseInt(year);
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .populate('group', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('group', 'name members leader guide');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Prevent password update through this endpoint
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// Get all guides
exports.getAllGuides = async (req, res) => {
  try {
    const guides = await User.find({ role: 'guide', isActive: true })
      .select('name email department phone');

    res.json({
      success: true,
      data: guides
    });
  } catch (error) {
    console.error('Get guides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guides'
    });
  }
};
