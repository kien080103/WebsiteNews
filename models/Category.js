const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa Schema cho Danh mục (Category)
const CategorySchema = new Schema({
  // Tên danh mục, là duy nhất và bắt buộc
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true // Loại bỏ khoảng trắng ở đầu và cuối
  },
  // Slug (đường dẫn thân thiện), là duy nhất và bắt buộc
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Chuyển về chữ thường
    trim: true
  },
  // Mô tả ngắn gọn về danh mục (tùy chọn)
  description: {
    type: String,
    trim: true
  },
  // Thời gian tạo bản ghi
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Thời gian cập nhật bản ghi gần nhất
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Cập nhật trường 'updatedAt' mỗi khi tài liệu được lưu
CategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Xuất (export) model Category
module.exports = mongoose.model('Category', CategorySchema);
