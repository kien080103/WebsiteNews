const Comment = require('../models/Comment');
const Post = require('../models/Post');

// GET /api/comments/post/:postId
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate('userId', 'username') // hiển thị tên người bình luận
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error('Lỗi khi lấy bình luận theo postId:', err);
    res.status(500).json({ error: 'Không thể tải bình luận cho bài viết này' });
  }
};
// GET /api/comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('postId', 'title')
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Không thể tải bình luận' });
  }
};

// PUT /api/comments/:id
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ params
    const { content, status } = req.body; // Lấy dữ liệu từ body

    // Kiểm tra xem bình luận có tồn tại không
    const comment = await Comment.findById(id)
      .populate('postId', 'title')
      .populate('userId', 'username');

    if (!comment) {
      return res.status(404).json({ error: 'Bình luận không tồn tại.' });
    }

    // Kiểm tra quyền (chỉ cho phép admin hoặc người tạo bình luận chỉnh sửa)
    if (req.user.role !== 'admin' && comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Bạn không có quyền chỉnh sửa bình luận này.' });
    }

    // Kiểm tra dữ liệu đầu vào
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Nội dung bình luận không hợp lệ.' });
    }

    if (status && !['pending', 'approved'].includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ.' });
    }

    // Cập nhật bình luận
    comment.content = content;
    if (status) comment.status = status;
    comment.updatedAt = Date.now();

    await comment.save();

    res.json({ message: 'Cập nhật bình luận thành công.', comment });
  } catch (err) {
    console.error('Lỗi khi cập nhật bình luận:', err);

    // Xử lý lỗi cụ thể hơn
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Dữ liệu không hợp lệ.' });
    }

    res.status(500).json({ error: 'Cập nhật thất bại.' });
  }
};

// DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xoá bình luận' });
  } catch (err) {
    res.status(500).json({ error: 'Xoá thất bại' });
  }
};


// POST: Gửi bình luận mới
exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Kiểm tra xem bài viết có tồn tại không
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Bài viết không tồn tại' });
    }

    // Tạo bình luận mới
    const newComment = new Comment({
      content,
      postId,
      userId: req.user._id, // Lấy ID người dùng từ token
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Lỗi khi tạo bình luận:', err);
    res.status(500).json({ error: 'Không thể tạo bình luận' });
  }
};
// POST: Thêm bình luận mới
exports.createCommentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Kiểm tra xem bài viết có tồn tại không
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Bài viết không tồn tại' });
    }

    // Tạo bình luận mới
    const newComment = new Comment({
      content,
      postId,
      userId: req.user._id, // Lấy ID người dùng từ token
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Lỗi khi tạo bình luận:', err);
    res.status(500).json({ error: 'Không thể tạo bình luận' });
  }
};


