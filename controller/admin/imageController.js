// --- START OF FILE imageController.js ---

const Image = require('../../models/Image');
const Book = require('../../models/Book'); // Keep Book if needed for other functions, otherwise remove
const mongoose = require('mongoose'); // For ObjectId validation

// REMOVE - This seems misplaced here. Should be in a client controller.
// exports.getHomePage = async (req, res) => { ... };

// REMOVE - Upload is handled during book creation/update in book.controller.js
// exports.uploadImage = async (req, res) => { ... };

// GET /api/images/:id - Serves the image data
exports.getImageById = async (req, res) => {
    try {
        const imageId = req.params.id;
        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(imageId)) {
            return res.status(400).send('Invalid Image ID format.');
        }

        const image = await Image.findById(imageId);

        // Check if image exists and has data/contentType
        if (!image || !image.data || !image.contentType) {
            // You might want to send a default placeholder image instead of 404
            // return res.sendFile(path.join(__dirname, '../../public/images/placeholder.png'));
            return res.status(404).send("Không tìm thấy ảnh.");
        }

        // Set the correct content type header
        res.contentType(image.contentType);
        // Send the image buffer data as the response body
        res.send(image.data);

    } catch (error) {
        console.error(`Lỗi khi lấy ảnh ID ${req.params.id}:`, error);
        // Avoid sending detailed error messages to the client in production
        res.status(500).send("Lỗi server khi lấy ảnh.");
    }
};

// (Optional) GET /api/images/book/:bookId - Get all image IDs/URLs for a book
exports.getImagesByBookId = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: "Invalid Book ID format." });
        }

        // Find images associated with the bookId, selecting only the _id field
        const images = await Image.find({ bookId: bookId }).select('_id');

        if (!images || images.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy ảnh cho sách này." });
        }

        // Map the results to an array of objects containing ID and URL
        const imageUrls = images.map(img => ({
            id: img._id,
            // Construct the URL pointing to the getImageById endpoint
            url: `/api/images/${img._id}` // Adjust path if your route is different
        }));

        res.status(200).json(imageUrls);
    } catch (error) {
        console.error("Lỗi khi lấy ảnh theo bookId:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};
// --- END OF FILE imageController.js ---