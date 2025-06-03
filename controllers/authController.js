const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secretKey } = require('../middleware/auth');

// Đăng ký
exports.register = async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username hoặc email đã được sử dụng' });
        }

        const newUser = new User({ username, email, password, fullName });
        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Tên đăng nhập không tồn tại' });

        const valid = await user.comparePassword(password);
        if (!valid) return res.status(400).json({ error: 'Sai mật khẩu' });

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role,
            },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi server' });
    }
};