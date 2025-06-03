const Post = require('../models/Post');
const mongoose = require('mongoose');
const slugify = require('slugify'); // Sử dụng thư viện để tạo slug

// Hàm fallback nếu không dùng slugify
function createSlug(text) {
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // bỏ dấu tiếng Việt
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

// @desc    Tạo bài viết mới
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { title, slug, content, status, tags, categories, createdAt } = req.body;
    const featuredImage = req.file ? `/image/${req.file.filename}` : '';

    const postSlug = slug || slugify(title, { lower: true, strict: true }) || createSlug(title);

    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    const categoriesArray = categories ? categories.split(',').map(c => c.trim()) : [];

    const newPost = new Post({
      title,
      slug: postSlug,
      content,
      status,
      tags: tagsArray,
      categories: categoriesArray,
      featuredImage,
      authorId: req.user._id,
      createdAt: createdAt || new Date(),
      publishedAt: status === 'published' ? new Date() : null
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    if (err.code === 11000 && err.keyPattern?.slug) {
      return res.status(400).json({ message: 'Slug already exists. Please choose a different title or slug.' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Lấy tất cả bài viết đã xuất bản (có phân trang)
// @route   GET /api/posts
// @access  Public
exports.getAllPublishedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ status: 'published' })
      .populate('authorId', 'username fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Lấy bài viết theo ID và tăng lượt xem
// @route   GET /api/posts/:id
// @access  Public
exports.getPostByIdAndIncrementViews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Post ID' });
    }

    const post = await Post.findById(req.params.id)
      .populate('authorId', 'username fullName');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.viewCount = (post.viewCount || 0) + 1;
    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Cập nhật bài viết
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Post ID' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to update this post' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Xóa bài viết
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Post ID' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Tìm kiếm bài viết
// @route   GET /api/posts/search?q=keyword
// @access  Public
exports.searchPublishedPosts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Please provide a search query (q).' });
    }

    const searchRegex = new RegExp(q, 'i');

    const results = await Post.find({
      $or: [
        { title: searchRegex },
        { content: searchRegex }
      ],
      status: 'published'
    })
    .populate('authorId', 'username fullName')
    .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Lọc bài viết theo danh mục
// @route   GET /api/posts/category/:category
// @access  Public
exports.getPostsByCategory = async (req, res) => {
  try {
    const posts = await Post.find({
      categories: req.params.category,
      status: 'published'
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Lọc bài viết theo tag
// @route   GET /api/posts/tag/:tag
// @access  Public
exports.getPostsByTag = async (req, res) => {
  try {
    const posts = await Post.find({
      tags: req.params.tag,
      status: 'published'
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// @desc    Lấy tất cả bài viết của người dùng
// @route   GET /api/posts/user/:userId 
