const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comments');
const auth = require('../middleware/auth');

router.get('/post/:postId', commentController.getCommentsByPost);

// GET all comments
router.get('/', commentController.getAllComments);

// UPDATE comment
router.put('/:id', commentController.updateComment);

// DELETE comment
router.delete('/:id', commentController.deleteComment);

// CREATE comment
router.post(
  '/',
  auth.authenticate,
  auth.authorize(['admin', 'author', 'user']),
  commentController.createComment
);


module.exports = router;
