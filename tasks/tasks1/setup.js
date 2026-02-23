const fs = require("fs");
const path = require("path");

// Đường dẫn gốc (nơi chạy script)
const rootDir = __dirname;
const frontendDir = path.join(rootDir, "frontend");
const backendDir = path.join(rootDir, "backend");

console.log("🚀 Bắt đầu thiết lập cấu trúc dự án...");

// 1. Tạo thư mục frontend và backend
if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir);
if (!fs.existsSync(backendDir)) fs.mkdirSync(backendDir);
if (!fs.existsSync(path.join(backendDir, "models")))
  fs.mkdirSync(path.join(backendDir, "models"));
if (!fs.existsSync(path.join(backendDir, "routes")))
  fs.mkdirSync(path.join(backendDir, "routes"));

// 2. Di chuyển các file Frontend vào thư mục frontend/
const filesToMove = ["Index.html", "admin.html", "assets"];

filesToMove.forEach((file) => {
  const oldPath = path.join(rootDir, file);
  const newPath = path.join(frontendDir, file);

  if (fs.existsSync(oldPath)) {
    // Di chuyển file hoặc thư mục
    fs.renameSync(oldPath, newPath);
    console.log(`✅ Đã chuyển: ${file} -> frontend/${file}`);
  } else {
    console.warn(`⚠️ Không tìm thấy: ${file} (Có thể đã di chuyển rồi)`);
  }
});

// 3. Tạo các file Backend

// backend/package.json
const packageJsonContent = `{
  "name": "techstore-backend",
  "version": "1.0.0",
  "description": "Backend API for TechStore",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "mongoose": "^7.0.3"
  }
}`;
fs.writeFileSync(path.join(backendDir, "package.json"), packageJsonContent);
console.log("✅ Đã tạo: backend/package.json");

// backend/server.js
const serverJsContent = `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/techstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Đã kết nối MongoDB'))
.catch(err => console.error('❌ Lỗi kết nối DB:', err));

// Routes
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
    console.log(\`🚀 Server đang chạy tại http://localhost:\${PORT}\`);
});`;
fs.writeFileSync(path.join(backendDir, "server.js"), serverJsContent);
console.log("✅ Đã tạo: backend/server.js");

// backend/models/Product.js
const productModelContent = `const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    img: String,
    badge: String,
    badgeColor: String,
    voucher: String,
    specs: [String]
});

module.exports = mongoose.model('Product', productSchema);`;
fs.writeFileSync(
  path.join(backendDir, "models", "Product.js"),
  productModelContent,
);
console.log("✅ Đã tạo: backend/models/Product.js");

// backend/routes/productRoutes.js
const productRoutesContent = `const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET: Lấy tất cả sản phẩm
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Thêm sản phẩm mới
router.post('/', async (req, res) => {
    const product = new Product(req.body);
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT: Cập nhật sản phẩm
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { id: req.params.id }, 
            req.body, 
            { new: true }
        );
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Xóa sản phẩm
router.delete('/:id', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Đã xóa sản phẩm' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;`;
fs.writeFileSync(
  path.join(backendDir, "routes", "productRoutes.js"),
  productRoutesContent,
);
console.log("✅ Đã tạo: backend/routes/productRoutes.js");

console.log("\\n🎉 Cấu trúc dự án đã được tạo thành công!");
console.log("👉 Bước tiếp theo:");
console.log("1. Mở terminal tại thư mục 'backend'");
console.log("2. Chạy lệnh: npm install");
console.log("3. Chạy lệnh: node server.js");
