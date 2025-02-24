const mongoose = require('mongoose');
const User = require('../models/User');  // Đảm bảo đường dẫn đúng với file model của bạn
const Category = require('../models/Category');
const Publisher = require('../models/Publisher');
const Book = require('../models/Book');
const Discount = require('../models/Discount');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URL; // Sử dụng MONGO_URL thay vì MONGO_URI

        if (!uri) {
            throw new Error('MongoDB URI is undefined!');
        }

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected successfully!");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};
// Hàm seed dữ liệu
async function seedData() {
    // 1. Thêm User
    const user = new User({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'user',
        phone: '1234567890',
        address: '123 Main St',
    });
    await user.save();
    console.log('User added');

    // 2. Thêm Category
    const category = new Category({
        name: 'Fiction',
        description: 'Books that tell fictional stories.',
    });
    await category.save();
    console.log('Category added');

    // 3. Thêm Publisher
    const publisher = new Publisher({
        name: 'Sample Publisher',
        address: '456 Publisher St',
        phone: '9876543210',
        email: 'publisher@example.com',
    });
    await publisher.save();
    console.log('Publisher added');

    // 4. Thêm Book
    const book = new Book({
        title: 'Sample Book',
        author: 'John Smith',
        categoryId: category._id, // ID của Category đã tạo
        publisherId: publisher._id, // ID của Publisher đã tạo
        price: 20,
        stock: 100,
        description: 'A sample book description',
        coverImage: 'samplebook.jpg',
    });
    await book.save();
    console.log('Book added');

    // 5. Thêm Discount
    const discount = new Discount({
        code: 'DISCOUNT10',
        description: '10% off on all books',
        discountType: 'percent',
        value: 10,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        isActive: true,
    });
    await discount.save();
    console.log('Discount added');

    // 6. Thêm Order
    const order = new Order({
        userId: user._id, // ID của User đã tạo
        discountId: discount._id, // ID của Discount đã tạo
        totalAmount: 100,
        paymentMethod: 'credit card',
    });
    await order.save();
    console.log('Order added');

    // 7. Thêm OrderDetail
    const orderDetail = new OrderDetail({
        orderId: order._id, // ID của Order đã tạo
        bookId: book._id, // ID của Book đã tạo
        quantity: 2,
        price: book.price,
        total: book.price * 2,
    });
    await orderDetail.save();
    console.log('OrderDetail added');

    console.log('All data has been seeded!');
    mongoose.connection.close(); // Đóng kết nối sau khi hoàn tất
}
module.exports = connectDB;
