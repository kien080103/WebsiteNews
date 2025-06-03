const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comments');
// Load biến môi trường
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.error('❌ Lỗi MongoDB:', err));

// Routes
app.use('/api/posts', require('./routes/posts'));

app.use('/admin/posts', require('./routes/posts'));

app.use('/api/comments', require('./routes/comments'));

app.use('/admin/comments', require('./routes/comments'));
app.use('/api/auth', authRoutes);

// Cấu hình phục vụ tệp tĩnh từ thư mục "uploads"
app.use('/image', express.static('image'));


// app.use('/image', express.static(path.join(__dirname, 'image')));

// app.use('/admin', postsRouter);

// ==== ROUTE API POSTS ====



// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy ở cổng http://localhost:${PORT}`));
