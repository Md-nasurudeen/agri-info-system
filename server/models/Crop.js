const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    season: { type: String, required: true },
    growthDuration: { type: Number, required: true },
    description: { type: String },
});

module.exports = mongoose.model('Crop', cropSchema);