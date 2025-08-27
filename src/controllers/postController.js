const Post = require('../models/postModel')

// Create post 
exports.createpost = async (req,res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        
        const postData = {
            title: req.body.title,
            description: req.body.description,
            author: req.body.author
        };
        
        // Add media files if uploaded
        if (req.files && req.files.length > 0) {
            postData.media = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            }));
        }
        
        const post = new Post(postData)
        await post.save()
        res.status(201).json(post)
    } catch (error) {
        console.error('Error creating post:', error);
        
        // Handle specific error types
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Failed to create post',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    } 
}

// Get All post 
exports.getposts = async (req,res) => {
    try {
        const post = await Post.find()
        res.json(post)
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch posts',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    } 
}

// Get Single post 
exports.getpostById = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ 
            success: false,
            message: 'Post not found',
            error: 'The requested post does not exist',
            timestamp: new Date().toISOString()
        })
        res.json(post)
    } catch (error) {
        console.error('Error getting post by ID:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch post',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    } 
}

// Update post 
exports.updatepost = async (req,res) => {
    try {
        console.log('Update request - ID:', req.params.id);
        console.log('Update request - Body:', req.body);
        console.log('Update request - File:', req.file);
        
        const updateData = {
            title: req.body.title,
            description: req.body.description,
            author: req.body.author
        };
        
        // Add media files if new files were uploaded
        if (req.files && req.files.length > 0) {
            updateData.media = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            }));
            console.log('New media files added:', req.files.length, 'files');
        }
        
        console.log('Final update data:', updateData);
        
        const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
            new: true, 
            runValidators: true
        });
        
        if (!post) {
            console.log('Post not found for ID:', req.params.id);
            return res.status(404).json({ 
                success: false,
                message: 'Post not found',
                error: 'The post you are trying to update does not exist',
                timestamp: new Date().toISOString()
            });
        }
        
        console.log('Post updated successfully:', post);
        res.json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Failed to update post',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    } 
}

// Delete post 
exports.deletepost = async (req,res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)
         if (!post) return res.status(404).json({ 
            success: false,
            message: 'Post not found',
            error: 'The post you are trying to delete does not exist',
            timestamp: new Date().toISOString()
        })
        res.json({ 
            success: true,
            message: 'Post deleted successfully',
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete post',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    } 
}

// Search posts (by title or author)
exports.searchposts = async (req, res) => {
  try {
    const { query } = req.query   // e.g. /api/posts/search?query=John

    if (!query) {
      return res.status(400).json({ 
        success: false,
        message: "Query parameter is required",
        error: "Please provide a search query",
        timestamp: new Date().toISOString()
      })
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },   // case-insensitive
        { author: { $regex: query, $options: "i" } }
      ]
    })

    res.json(posts)
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to search posts',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}