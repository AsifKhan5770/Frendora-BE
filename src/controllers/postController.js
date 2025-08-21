const Post = require('../models/postModel')

// Create post 
exports.createpost = async (req,res) => {
    try {
        const post = new Post(req.body)
        await post.save()
        res.status(201).json(post)
    } catch (error) {
        res.status(400).json({ message: error.message })
    } 
}

// Get All post 
exports.getposts = async (req,res) => {
    try {
        const post = await Post.find()
        res.json(post)
    } catch (error) {
        res.status(500).json({ message: error.message })
    } 
}

// Get Single post 
exports.getpostById = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ message: 'post not found' })
        res.json(post)
    } catch (error) {
        res.status(500).json({ message: error.message })
    } 
}

// Update post 
exports.updatepost = async (req,res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true
        })
         if (!post) return res.status(404).json({ message: 'post not found' })
        res.json(post)
    } catch (error) {
        res.status(400).json({ message: error.message })
    } 
}

// Delete post 
exports.deletepost = async (req,res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)
         if (!post) return res.status(404).json({ message: 'post not found' })
        res.json({ message: 'post deleted'})
    } catch (error) {
        res.status(500).json({ message: error.message })
    } 
}

// Search posts (by title or author)
exports.searchposts = async (req, res) => {
  try {
    const { query } = req.query   // e.g. /api/posts/search?query=John

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" })
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },   // case-insensitive
        { author: { $regex: query, $options: "i" } }
      ]
    })

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}