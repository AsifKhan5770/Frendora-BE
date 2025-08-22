const bcrypt = require('bcryptjs');

const User = require('../models/userModel')

// Create user
exports.createuser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({ name, email: email.trim().toLowerCase(), password });
    await user.save();

    const { password: _, ...safeUser } = user.toObject(); // hide password
    res.status(201).json({ message: "User created successfully", user: safeUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
// Get All user
exports.getusers = async (req,res) => {
    try {
        const user = await User.find()
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    } 
}

// Get Single user
exports.getuserById = async (req,res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ message: 'user not found' })
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    } 
}

// Update user 
exports.updateuser = async (req,res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true
        })
         if (!user) return res.status(404).json({ message: 'user not found' })
        res.json(user)
    } catch (error) {
        res.status(400).json({ message: error.message })
    } 
}

// Delete user 
exports.deleteuser = async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
         if (!user) return res.status(404).json({ message: 'user not found' })
        res.json({ message: 'user deleted'})
    } catch (error) {
        res.status(500).json({ message: error.message })
    } 
}

// Search user (by title or author)
exports.searchusers = async (req, res) => {
  try {
    const { query } = req.query   // e.g. /api/users/search?query=John

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" })
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },   // case-insensitive
        { email: { $regex: query, $options: "i" } }
      ]
    })

    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Login user
exports.loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Normalize email
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Hide password before sending response
    const { password: _, ...safeUser } = user.toObject();
    res.json({ message: "Login successful", user: safeUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get profile by ID (hide password)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update name
exports.updateName = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Name updated", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare old password with hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" });

    // Hash new password before saving
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};