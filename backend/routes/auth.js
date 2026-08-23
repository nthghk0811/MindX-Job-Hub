const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'mindx_job_hub_secret_jwt_key_2026_default';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ Warning: JWT_SECRET is not set in environment. Using default secret key.');
}

// ── POST /api/auth/login ──────────────────────────────
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp đầy đủ tên đăng nhập và mật khẩu.',
    });
  }

  // 1. Check hardcoded admin credentials first
  if (
    username.trim().toLowerCase() === ADMIN_USER.toLowerCase() &&
    password === ADMIN_PASSWORD
  ) {
    const payload = { username: ADMIN_USER, role: 'admin', name: 'SS Team Admin' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, message: 'Đăng nhập thành công', token, user: payload });
  }

  // 2. Check MongoDB users (students)
  try {
    const user = await User.findOne({
      $or: [
        { username: username.trim().toLowerCase() },
        { email: username.trim().toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác.' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        code: 'PENDING_APPROVAL',
        message: 'Tài khoản của bạn đang chờ admin duyệt. Vui lòng thử lại sau.',
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        code: 'REJECTED',
        message: `Tài khoản bị từ chối${user.rejectedReason ? ': ' + user.rejectedReason : ''}. Vui lòng liên hệ team SS.`,
      });
    }

    // approved
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role,
      name: user.fullName,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, message: 'Đăng nhập thành công', token, user: payload });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/auth/register ───────────────────────────
router.post('/register', async (req, res) => {
  const { fullName, username, email, password, course } = req.body || {};

  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Mật khẩu tối thiểu 6 ký tự.' });
  }

  // Block registering with admin username
  if (username.trim().toLowerCase() === ADMIN_USER.toLowerCase()) {
    return res.status(400).json({ success: false, message: 'Tên đăng nhập này không hợp lệ.' });
  }

  try {
    const existing = await User.findOne({
      $or: [{ username: username.trim().toLowerCase() }, { email: email.trim().toLowerCase() }],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: existing.username === username.trim().toLowerCase()
          ? 'Tên đăng nhập đã tồn tại.'
          : 'Email đã được sử dụng.',
      });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password,
      course: course?.trim() || '',
      role: 'student',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công! Tài khoản đang chờ admin duyệt.',
      user: { username: user.username, email: user.email, status: user.status },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/auth/me ──────────────────────────────────
router.get('/me', authMiddleware, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
