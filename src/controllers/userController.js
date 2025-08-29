const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// Helper to generate JWT
const generateToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ✅ Create user (Register)
exports.createuser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    console.log('Signup - Original password length:', password.length);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: password, // Let the model handle hashing
    });

    res.status(201).json({
      message: "User created successfully",
      token: generateToken(user._id, user.name),
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        avatarUrl: user.avatarUrl 
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get All Users
exports.getusers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Single User by ID
exports.getuserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update User by ID
exports.updateuser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete User by ID
exports.deleteuser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Search Users by name or email
exports.searchusers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query parameter is required" });

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login User
exports.loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log('Login attempt - Email:', email);
    console.log('Login attempt - Input password length:', password.length);
    console.log('Login attempt - Stored hash length:', user.password.length);
    console.log('Login attempt - Hash starts with:', user.password.substring(0, 10) + '...');

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Login attempt - Password match:', isMatch);
    
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: generateToken(user._id, user.name),
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        avatarUrl: user.avatarUrl 
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Profile (Protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Name (Protected)
exports.updateName = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Name updated successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Change Password (Protected)
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log('Change password attempt - User ID:', req.params.id);
    console.log('Change password attempt - Old password length:', oldPassword.length);
    console.log('Change password attempt - Stored hash length:', user.password.length);
    console.log('Change password attempt - Hash starts with:', user.password.substring(0, 10) + '...');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    console.log('Change password attempt - Old password match:', isMatch);
    
    if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" });

    // Set plain text password - let the model pre-save hook handle hashing
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Upload Avatar (Protected)
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No avatar file uploaded" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatarUrl: req.file.filename },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ 
      message: "Avatar uploaded successfully", 
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete Avatar (Protected)
exports.deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove avatar filename from user document
    user.avatarUrl = undefined;
    await user.save();

    res.json({ message: "Avatar deleted successfully", user: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};