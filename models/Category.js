const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
     _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, unique: true },
    description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
