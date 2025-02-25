const mongoose = require('mongoose');
const publisherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Publisher', publisherSchema);