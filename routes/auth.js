const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);


module.exports = router;