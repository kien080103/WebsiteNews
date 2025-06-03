const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');
// const { protect, authorize } = require('../middleware/auth'); // Cần middleware xác thực/phân quyền sau

// Định nghĩa các route cho API danh mục

// POST /api/categories - Tạo danh mục mới (Chỉ admin)
router.post('/', categoriesController.createCategory); // TODO: Thêm middleware protect, authorize('admin')

// GET /api/categories - Lấy tất cả danh mục
router.get('/', categoriesController.getAllCategories);

// GET /api/categories/:id - Lấy danh mục theo ID
router.get('/:id', categoriesController.getCategoryById);

// PUT /api/categories/:id - Cập nhật danh mục theo ID (Chỉ admin)
router.put('/:id', categoriesController.updateCategory); // TODO: Thêm middleware protect, authorize('admin')

// DELETE /api/categories/:id - Xóa danh mục theo ID (Chỉ admin)
router.delete('/:id', categoriesController.deleteCategory); // TODO: Thêm middleware protect, authorize('admin')

module.exports = router;
