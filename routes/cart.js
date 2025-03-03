const express = require("express");
const router = express.Router();
const { getCartByUserId ,addBookToCart,removeBookFromCart} = require("../controller/Client/cart.controller");

router.get("/", async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.redirect('/');
    }
    res.render("client/cart");
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    res.render("client/cart", { cart: { items: [] }, message: "Đã xảy ra lỗi khi tải giỏ hàng." });
  }
});

router.post("/add", async (req, res) => {
  try {
    // Kiểm tra nếu user chưa đăng nhập
    if (!req.session.user || !req.session.user.id) {
      return res.redirect('/auth/login');
    }
    const previousUrl = req.headers.referer || '/';
    const userId = req.session.user.id;
    const { quantity, bookId } = req.body;
    // Kiểm tra quantity hợp lệ
    let qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      qty = 1; // Mặc định là 1 nếu không hợp lệ
    }
    await addBookToCart(userId, bookId, qty);
    return res.redirect(previousUrl);
  } catch (error) {
    console.error("Lỗi khi thêm sách vào giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
});

router.post("/remove", async (req, res) => {
  try {
    // Kiểm tra nếu user chưa đăng nhập
    if (!req.session.user || !req.session.user.id) {
      return res.redirect('/auth/login');
    }

    const userId = req.session.user.id;
    const { bookId } = req.body;
    await removeBookFromCart(userId, bookId);
    return res.redirect("/cart");
  } catch (error) {
    console.error("Lỗi khi xóa sách khỏi giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
