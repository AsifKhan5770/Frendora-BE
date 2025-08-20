const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'post name is required']
    },
    description: String,
    author: {
        type: String,
        required: [true, 'Author is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('posts', postSchema)