
const Book = require("../../models/Book");

const applyDiscountInfoToBooks = (books) => {
    return books.map(book => {
        const bookObj = book.toObject(); // Chuyển sang object để gán giá trị mới
        if (bookObj.note && bookObj.note.includes("Mã:")) {
            const match = bookObj.note.match(/Mã:.*?(?:Phần trăm|Cố định) - ([\d.]+)(%|đ)/);
            if (match) {
                const value = parseFloat(match[1]);
                const type = match[2];
                bookObj.hasDiscount = true;
                bookObj.originalPrice = bookObj.price;

                if (type === '%') {
                    bookObj.discountedPrice = Math.floor(bookObj.price * (1 - value / 100));
                } else {
                    bookObj.discountedPrice = Math.floor(bookObj.price - value);
                }
            }
        }
        return bookObj;
    });
};

const getAllBooks = async () => {
    try {
        const books = await Book.find().populate("categoryId", "name").populate("publisherId", "name");
        return applyDiscountInfoToBooks(books);
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        return [];
    }
};

const getProductById = async (bookId) => {
    try {
        const book = await Book.findById(bookId).populate("categoryId", "name").populate("publisherId", "name");
        return applyDiscountInfoToBooks([book])[0]; // Chuyển đổi sang object và lấy phần tử đầu tiên;
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        return null;
    }
};


// Lấy sản phẩm theo danh mục
const getProductByCategory = async (_idCategory) => {
    try {
        const products = await Book.find({ categoryId: _idCategory });
        return applyDiscountInfoToBooks(products); // Áp dụng thông tin giảm giá cho sản phẩm
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
        return [];
    }
};
const getProductByPublisher = async (_idPublisher)=>{
    try {
        const products = await Book.find({ publisherId: _idPublisher});
        return applyDiscountInfoToBooks(products); // Áp dụng thông tin giảm giá cho sản phẩm
    } catch (error) {
        
    }
};
const findProductByName = async (name) => {
    try {
        const products = await Book.find({ title: { $regex: name, $options: "i" } });
        return applyDiscountInfoToBooks(products) ; 
    } catch (error) {
        console.error("Lỗi khi tìm sản phẩm theo tên:", error);
        return [];
    }
};

const sortByPrice = async (sortType) => {
    try {
        const products = await Book.find().sort({ price: sortType });
        return applyDiscountInfoToBooks(products); // Áp dụng thông tin giảm giá cho sản phẩm
    } catch (error) {
        console.error("Lỗi khi tìm sản phẩm theo tên:", error);
        return [];
    }
};  
const sortBySelling = async (sortType) => {
    try {
        const products = await Book.find().sort({ selling: sortType });
        return applyDiscountInfoToBooks(products); // Áp dụng thông tin giảm giá cho sản phẩm
    } catch (error) {
        console.error("Lỗi khi tìm sản phẩm theo tên:", error);
        return [];
    }
}
const getProductByFilter = async (filterFrom,filterTo) => {
    try {
        const products = await Book.find({price: {$gte: filterFrom,$lte: filterTo}}).sort({ price: 1 }) // Tăng dần
        return applyDiscountInfoToBooks(products); 
    } catch (error) {
        console.error("Lỗi khi tìm sản phẩm theo tên:", error);
        return [];
    }
}
const updateRating = async (bookId, rating) => {
    try {
        const product = await Book.findById(bookId);
        if (!product) {
            console.error("Sản phẩm không tồn tại");
            return null;
        }
        product.averageRating = ((product.averageRating*product.totalVotes)+rating) / (product.totalVotes+1); 
        product.averageRating = product.averageRating.toFixed(1); 
        product.totalVotes += 1; 
        await product.save();
    } catch (error) {
        console.error("Lỗi khi cập nhật rating:", error);
        return null;
        
    }
}
// Đảm bảo export đúng
module.exports = { getAllBooks, getProductById , getProductByCategory, findProductByName, sortByPrice, sortBySelling ,updateRating, applyDiscountInfoToBooks, getProductByPublisher, getProductByFilter};

