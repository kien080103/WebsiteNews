const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const { authenticate, authorize } = require('../middleware/auth');
const multer = require('multer');

// Cấu hình Multer để lưu file ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/image');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

/** ===== PUBLIC ROUTES ===== **/

// GET /api/posts/search?q=... - Tìm kiếm bài viết
router.get('/search', postsController.searchPublishedPosts);

// GET /api/posts/category/:category - Lọc theo danh mục
router.get('/category/:category', postsController.getPostsByCategory);

// GET /api/posts/tag/:tag - Lọc theo tag
router.get('/tag/:tag', postsController.getPostsByTag);

// GET /api/posts - Lấy tất cả bài viết đã xuất bản (có phân trang)
router.get('/', postsController.getAllPublishedPosts);

// GET /api/posts/:id - Lấy chi tiết bài viết và tăng view
router.get('/:id', postsController.getPostByIdAndIncrementViews);


/** ===== PROTECTED ROUTES ===== **/

// POST /api/posts - Tạo bài viết mới
router.post(
  '/',
  authenticate,
  authorize(['admin', 'author']),
  upload.single('featuredImage'),
  postsController.createPost
);

// PUT /api/posts/:id - Cập nhật bài viết
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'author']),
  postsController.updatePost
);

// DELETE /api/posts/:id - Xóa bài viết
router.delete(
  '/:id',
  authenticate,
  authorize(['admin', 'author']),
  postsController.deletePost
);

module.exports = router;
