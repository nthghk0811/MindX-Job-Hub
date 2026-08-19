const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'mindx_job_hub_secret_jwt_key_2026_default';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ Warning: JWT_SECRET is not set in environment. Using default secret key.');
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp đầy đủ tên đăng nhập và mật khẩu.',
    });
  }

  // Validate admin credentials
  if (username.trim().toLowerCase() === ADMIN_USER.toLowerCase() && password === ADMIN_PASSWORD) {
    const payload = {
      username: ADMIN_USER,
      role: 'admin',
      name: 'SS Team Admin',
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: payload,
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Tài khoản hoặc mật khẩu không chính xác.',
  });
});

// GET /api/auth/me (Verify token)
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
