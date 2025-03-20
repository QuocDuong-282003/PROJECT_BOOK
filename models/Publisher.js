const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }], // Liên kết với sách
    createdAt: { type: Date, default: Date.now }


});

module.exports = mongoose.model("Publisher", publisherSchema);
