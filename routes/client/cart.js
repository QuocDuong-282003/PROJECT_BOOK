const express = require("express");
const router = express.Router();
const { getCartByUserId ,addBookToCart,removeBookFromCart, increaseQuantity , updateQuantity} = require("../../controller/Client/cart.controller");
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
    const previousUrl = req.headers.referer || '/';
    const userId = req.session.user.id;
    const { bookId } = req.body;
    await removeBookFromCart(userId, bookId);
    return res.redirect(previousUrl);
  } catch (error) {
    console.error("Lỗi khi xóa sách khỏi giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
});
router.put("/update", async(req,res)=>{
  try {
    const userId = req.session?.user?.id; 
    const bookId = req.body.bookId;
    if (!userId || !bookId) {
      return res.redirect('/auth/login');
    }
    
    const quantity = req.body.quantity;
    await updateQuantity(userId,bookId,quantity);
    res.json({success: true, message:"Số lượng đã cập nhật"});
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});
router.post("/increase", async (req, res) => {
  try {
    console.log("🔥 API được gọi");
    console.log("Dữ liệu nhận được:", req.body); // Kiểm tra dữ liệu gửi lên

    const userId = req.session?.user?.id;
    const bookId = req.body.bookId;

    if (!userId || !bookId) {
      console.log("Thiếu userId hoặc bookId");
      return res.status(400).json({ error: "Thiếu userId hoặc bookId" });
    }

    await increaseQuantity(userId, bookId);
    res.json({ success: true, message: "Số lượng đã tăng" });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
