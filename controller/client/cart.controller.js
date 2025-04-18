const Cart = require('../../models/Cart');
const Book = require('../../models/Book');
const { findById, findByIdAndUpdate } = require('../../models/Order');
const {applyDiscountInfoToBooks} = require('./product.controller');
const getCartByUserId = async (userId) => {
    try {
        const cart = await Cart.findOne({ userId })
            .populate({
                path: 'items.bookId'
            });
        return cart;
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        return null;
    }
};

const addBookToCart = async (userId, bookId, quantity) => {
    try {
        const book = await Book.findById(bookId).populate("discountId");
        if (!book) {
            throw new Error("Sách không tồn tại");
        }
        const quantityNumber = Number(quantity);
        if (quantityNumber <= 0) {
            throw new Error("Số lượng sách không hợp lệ");
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [],
                totalPrice: 0
            });
        }

        // Kiểm tra sách đã tồn tại trong giỏ chưa
        const existingItem = cart.items.find(item => item.bookId.toString() === bookId);

        if (existingItem) {
            existingItem.quantity += quantityNumber;
        } else {
            cart.items.push({ bookId, quantity: quantityNumber });
        }

        // Tính lại tổng tiền giỏ hàng
        // Lấy thông tin chi tiết sách trong items
        const populatedCart = await cart.populate({
            path: "items.bookId",
            populate: {
              path: "discountId" // Populate thêm discountId trong từng book
            }
          });
          

        let total = 0;
        populatedCart.items.forEach(item => {
            const book = item.bookId;
            const price = book.price;
            const discount = book.discountId?.value || 0;
            const discountedPrice = price * (1 - discount / 100);
            total += discountedPrice * item.quantity;
        });

        cart.totalPrice = parseFloat(total.toFixed(2));
        await cart.save();

        console.log("✅ Đã thêm sách vào giỏ hàng");

    } catch (error) {
        console.error("❌ Lỗi khi thêm sách vào giỏ hàng:", error.message);
    }
};



const removeBookFromCart = async (userId, bookId) => {
    try {
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.bookId',
            populate: { path: 'discountId' }
        });

        if (!cart) {
            throw new Error("Giỏ hàng không tồn tại");
        }

        const bookIndex = cart.items.findIndex(item => item.bookId._id.toString() === bookId);
        if (bookIndex === -1) {
            throw new Error("Sách không có trong giỏ hàng");
        }

        // Xóa item
        cart.items.splice(bookIndex, 1);

        // Tính lại tổng tiền
        let total = 0;
        for (const item of cart.items) {
            const price = item.bookId.price;
            const discount = item.bookId.discountId?.value || 0;
            const priceAfterDiscount = price * (1 - discount / 100);
            total += priceAfterDiscount * item.quantity;
        }

        cart.totalPrice = parseFloat(total.toFixed(2));

        await cart.save();
    } catch (error) {
        console.error("❌ Lỗi khi xóa sách khỏi giỏ hàng:", error.message);
    }
};

const clearCart = async (userId) => {
    try {
        const cartClear = await Cart.findOneAndDelete({ userId });
        if (!cartClear) {
            console.log(`❌ Không tìm thấy giỏ hàng của userId: ${userId}`);
            return null;
        }

        console.log(`🗑️ Đã xóa giỏ hàng của userId: ${userId}`);
        return cartClear;
    } catch (error) {
        console.error('❌ Lỗi khi xóa giỏ hàng:', error.message);
        return null;
    }
};

const updateQuantity = async (userId, bookId, quantityUpdate) => {
    try {
        const cart = await Cart.findOne({ userId }).populate({
            path: "items.bookId",
            populate: {
              path: "discountId" // Populate thêm discountId trong từng book
            }});
        if (!cart) {
            console.log(`❌ Không tìm thấy giỏ hàng của userId: ${userId}`);
            return null;
        }

        const itemIndex = cart.items.findIndex(item => item.bookId._id.toString() === bookId);
        if (itemIndex === -1) {
            console.log(`❌ Không tìm thấy sản phẩm có bookId: ${bookId}`);
            return null;
        }

        const quantity = Number(quantityUpdate);
        if (quantity <= 0) {
            // Xoá sản phẩm khỏi giỏ nếu số lượng <= 0
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        // Tính lại tổng giá tiền
        let total = 0;
        cart.items.forEach(item => {
            const book = item.bookId;
            const discount = book.discountId?.value || 0;
            const priceAfterDiscount = book.price * (1 - discount / 100);
            total += priceAfterDiscount * item.quantity;
        });

        cart.totalPrice = parseFloat(total.toFixed(2));
        await cart.save();

        console.log("✅ Cập nhật giỏ hàng thành công");
        return cart;

    } catch (error) {
        console.error("❌ Lỗi khi cập nhật số lượng:", error.message);
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

        const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
        if (itemIndex === -1) {
            console.log(`❌ Không tìm thấy sản phẩm có bookId: ${bookId}`);
            return null;
        }

        // Tăng số lượng sản phẩm
        cart.items[itemIndex].quantity += 1;

        // Cập nhật lại tổng giá tiền
        cart.totalPrice = parseFloat(
        cart.items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2)
        );
        // Lưu lại thay đổi
        await cart.save();
        return cart;
    } catch (error) {
        console.error("🔥 Lỗi khi cập nhật số lượng:", error);
    }
};

module.exports = { getCartByUserId , addBookToCart , removeBookFromCart, clearCart, increaseQuantity, updateQuantity};