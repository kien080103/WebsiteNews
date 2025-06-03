const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Đảm bảo đường dẫn đúng

// Khóa bí mật JWT - nên được lưu trữ trong biến môi trường
const secretKey = process.env.JWT_SECRET || 'yourFallbackSecretKey'; // Sử dụng biến môi trường hoặc fallback

const authenticate = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Yêu cầu xác thực' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        // decoded chứa { userId, role, username } (dựa trên lúc tạo token)
        const user = await User.findById(decoded.userId); // Tìm user theo ID từ token
        if (!user) {
            return res.status(401).json({ error: 'Token không hợp lệ' });
        }
        req.user = user; // Gán toàn bộ thông tin user vào req.user
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token không hợp lệ' });
    }
};

const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Không được phép' });
        }
        next();
    };
};

module.exports = async function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ header

    if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(401).json({ error: 'Người dùng không tồn tại' });

        req.user = user; // Gắn thông tin người dùng vào req
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token không hợp lệ' });
    }
}



module.exports = { authenticate, authorize, secretKey };