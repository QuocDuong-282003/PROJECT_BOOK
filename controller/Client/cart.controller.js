const Cart = require('../../models/Cart');
const Book = require('../../models/Book');
const User = require('../../models/User');

const getCartByUserId = async (userId) => {
    try {
        const cart = await Cart.findOne({ userId }).populate('items.bookId');
        return cart;
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        return null;
        
    }
}
const addBookToCart = async (userId, bookId, quantity) => {
    try {
        const book = await Book.findById(bookId);
        if (!book) {
            throw new Error("Sách không tồn tại");
        }

        const quantityNumber = Number(quantity);
        if (quantityNumber <= 0) {
            throw new Error("Số lượng sách không hợp lệ");
        }

        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Kiểm tra nếu sách đã có trong giỏ hàng
            const existingItem = cart.items.find(item => item.bookId.toString() === bookId);

            if (existingItem) {
                // Nếu sách đã có, cập nhật số lượng
                existingItem.quantity += quantityNumber;
            } else {
                // Nếu sách chưa có, thêm mới vào items
                cart.items.push({ bookId, title: book.title, quantity: quantityNumber, price: book.price });
            }

            // Cập nhật tổng giá tiền
            cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

            await cart.save();
        } else {
            // Nếu chưa có giỏ hàng, tạo mới
            cart = new Cart({
                userId,
                items: [{ bookId, title: book.title ,quantity: quantityNumber, price: book.price }],
                totalPrice: quantityNumber * book.price
            });

            await cart.save();
        }

    } catch (error) {
        console.error("Lỗi khi thêm sách vào giỏ hàng:", error);
    }
};

const removeBookFromCart = async (userId, bookId) => {
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            throw new Error("Giỏ hàng không tồn tại");
        }

        const bookIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
        if (bookIndex === -1) {
            throw new Error("Sách không có trong giỏ hàng");
        }

        cart.items.splice(bookIndex, 1);
        cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        await cart.save();
    } catch (error) {
        console.error("Lỗi khi xóa sách khỏi giỏ hàng:", error);
    }
}
module.exports = { getCartByUserId , addBookToCart , removeBookFromCart};