const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa Schema cho Thẻ (Tag)
const TagSchema = new Schema({
  // Tên thẻ, là duy nhất và bắt buộc
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  // Slug (đường dẫn thân thiện), là duy nhất và bắt buộc
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
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
TagSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Xuất (export) model Tag
module.exports = mongoose.model('Tag', TagSchema);
