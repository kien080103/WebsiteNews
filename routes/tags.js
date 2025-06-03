const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tags');
// const { protect, authorize } = require('../middleware/auth'); // Cần middleware xác thực/phân quyền sau

// Định nghĩa các route cho API thẻ

// POST /api/tags - Tạo thẻ mới (Chỉ admin)
router.post('/', tagsController.createTag); // TODO: Thêm middleware protect, authorize('admin')

// GET /api/tags - Lấy tất cả thẻ
router.get('/', tagsController.getAllTags);

// GET /api/tags/:id - Lấy thẻ theo ID
router.get('/:id', tagsController.getTagById);

// PUT /api/tags/:id - Cập nhật thẻ theo ID (Chỉ admin)
router.put('/:id', tagsController.updateTag); // TODO: Thêm middleware protect, authorize('admin')

// DELETE /api/tags/:id - Xóa thẻ theo ID (Chỉ admin)
router.delete('/:id', tagsController.deleteTag); // TODO: Thêm middleware protect, authorize('admin')

module.exports = router;
