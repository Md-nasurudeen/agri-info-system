const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/auth');

// Forum Post Schema
const forumPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

// Get all forum posts
router.get('/', async (req, res) => {
    try {
        const posts = await ForumPost.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching forum posts:', error.message);
        res.status(500).json({ error: 'Failed to fetch forum posts' });
    }
});

// Create a new forum post (protected)
router.post('/', authMiddleware, async (req, res) => {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
        return res.status(400).json({ error: 'Title, content, and author are required' });
    }

    try {
        const post = new ForumPost({ title, content, author, createdBy: req.user.userId });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating forum post:', error.message);
        res.status(500).json({ error: 'Failed to create forum post' });
    }
});

module.exports = router;