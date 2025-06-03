const Tag = require('../models/Tag');
const mongoose = require('mongoose');

// @desc    Tạo thẻ mới
// @route   POST /api/tags
// @access  Private (Chỉ admin)
exports.createTag = async (req, res) => {
  try {
    const { name, slug } = req.body;

    // Kiểm tra xem slug đã tồn tại chưa
    const existingTag = await Tag.findOne({ slug });
    if (existingTag) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    const newTag = new Tag({
      name,
      slug
    });

    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Lấy tất cả thẻ
// @route   GET /api/tags
// @access  Public
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 }); // Sắp xếp theo tên
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Lấy thẻ theo ID
// @route   GET /api/tags/:id
// @access  Public
exports.getTagById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid Tag ID' });
    }

    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Cập nhật thẻ theo ID
// @route   PUT /api/tags/:id
// @access  Private (Chỉ admin)
exports.updateTag = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid Tag ID' });
    }

    const updatedTag = await Tag.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json(updatedTag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Xóa thẻ theo ID
// @route   DELETE /api/tags/:id
// @access  Private (Chỉ admin)
exports.deleteTag = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid Tag ID' });
    }

    const deletedTag = await Tag.findByIdAndDelete(req.params.id);

    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // TODO: Cần xử lý các bài viết đang tham chiếu đến thẻ này (ví dụ: gỡ bỏ tham chiếu)

    res.json({ message: 'Tag removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// TODO: Thêm các hàm controller khác nếu cần (ví dụ: getPostsByTag)
