const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Crop Schema
const cropSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    season: { type: String, required: true },
    growthDuration: { type: Number, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Crop = mongoose.model('Crop', cropSchema);

// Get all crops
router.get('/', async (req, res) => {
    try {
        const crops = await Crop.find();
        res.json(crops);
    } catch (error) {
        console.error('Error fetching crops:', error.message);
        res.status(500).json({ error: 'Failed to fetch crops' });
    }
});

// Create a new crop (protected)
router.post('/', authMiddleware, async (req, res) => {
    const { name, type, season, growthDuration, description } = req.body;
    if (!name || !type || !season || !growthDuration || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const crop = new Crop({
            name,
            type,
            season,
            growthDuration,
            description,
            createdBy: req.user.userId,
        });
        await crop.save();
        res.status(201).json(crop);
    } catch (error) {
        console.error('Error creating crop:', error.message);
        res.status(500).json({ error: 'Failed to create crop' });
    }
});

module.exports = router;