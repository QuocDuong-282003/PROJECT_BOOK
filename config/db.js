const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URL; // Sử dụng MONGO_URL thay vì MONGO_URI
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        if (!uri) {
            throw new Error('MongoDB URI is undefined!');
        }
        console.log("✅ MongoDB connected successfully!");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};
module.exports = connectDB; // Export connectDB để sử dụng trong các file khác