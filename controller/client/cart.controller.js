const Cart = require('../../models/Cart');
const Book = require('../../models/Book');
const { findById, findByIdAndUpdate } = require('../../models/Order');

const getCartByUserId = async (userId) => {
    try {
        const cart = await Cart.findOne({ userId })
            .populate({
                path: 'items.bookId',
                select: 'title price stock' // Chỉ lấy các trường cần thiết
            });

        return cart;
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        return null;
    }
};

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
                existingItem.price = parseFloat(existingItem.quantity * book.price).toFixed(2);
            } else {
                // Nếu sách chưa có, thêm mới vào items
                const prices =parseFloat(quantityNumber * book.price).toFixed(2); 
                cart.items.push({ bookId, title: book.title, quantity: quantityNumber, price: prices });
            }

            // Cập nhật tổng giá tiền
            cart.totalPrice = parseFloat(cart.items.reduce((total, item) => total + item.price, 0).toFixed(2));

            await cart.save();
        } else {
            // Nếu chưa có giỏ hàng, tạo mới
            const prices =parseFloat(quantityNumber * book.price).toFixed(2);
            cart = new Cart({
                userId,
                items: [{ bookId ,quantity: quantityNumber, price: prices }],
                totalPrice: prices
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
        cart.totalPrice = parseFloat(cart.items.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2));

        await cart.save();
    } catch (error) {
        console.error("Lỗi khi xóa sách khỏi giỏ hàng:", error);
    }
}
const clearCart = async (userId) => {
    try {
        const cartClear = await Cart.findOneAndDelete({ userId });

        if (!cartClear) {
            console.log(`Không tìm thấy giỏ hàng của userId: ${userId}`);
            return null;
        }

        console.log(`Đã xóa giỏ hàng của userId: ${userId}`);
        return cartClear;
    } catch (error) {
        console.error('Lỗi khi xóa dữ liệu:', error.message);
        return null;
    }
};
const increaseQuantity = async (userId, bookId) => {
    try {
        // Tìm giỏ hàng theo userId
        const cart = await Cart.findOne({userId});
        if (!cart) {
            console.log(`❌ Không tìm thấy giỏ hàng của userId: ${userId}`);
            return null;
        }

        // Tìm item có bookId trong giỏ hàng
        const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
        if (itemIndex === -1) {
            console.log(`❌ Không tìm thấy sản phẩm có bookId: ${bookId}`);
            return null;
        }

        // Tăng số lượng sản phẩm
        cart.items[itemIndex].quantity += 1;
        console.log(`📌 Số lượng mới: ${cart.items[itemIndex].quantity}`);

        // Lưu lại thay đổi
        await cart.save();

        console.log("✅ Cập nhật số lượng thành công");
        return cart;
    } catch (error) {
        console.error("🔥 Lỗi khi cập nhật số lượng:", error);
    }
};

module.exports = { getCartByUserId , addBookToCart , removeBookFromCart, clearCart, increaseQuantity};