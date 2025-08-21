const User = require('../models/userModel')

// Create user 
exports.createuser = async (req,res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ message: error.message })
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