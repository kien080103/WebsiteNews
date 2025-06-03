const Category = require('../models/Category');
const mongoose = require('mongoose');

// @desc    Tạo danh mục mới
// @route   POST /api/categories
// @access  Private (Chỉ admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    // Kiểm tra xem slug đã tồn tại chưa
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    const newCategory = new Category({
      name,
      slug,
      description
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Lấy tất cả danh mục
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }); // Sắp xếp theo tên
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Lấy danh mục theo ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid Category ID' });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Cập nhật danh mục theo ID
// @route   PUT /api/categories/:id
// @access  Private (Chỉ admin)
exports.updateCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid Category ID' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(updatedCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Xóa danh mục theo ID
// @route   DELETE /api/categories/:id
// @access  Private (Chỉ admin)
exports.deleteCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid Category ID' });
    }

    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // TODO: Cần xử lý các bài viết đang tham chiếu đến danh mục này (ví dụ: gỡ bỏ tham chiếu)

    res.json({ message: 'Category removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// TODO: Thêm các hàm controller khác nếu cần (ví dụ: getPostsByCategory)
