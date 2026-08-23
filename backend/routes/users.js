const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminOnly');
const User = require('../models/User');

// ── GET /api/users — Danh sách users (admin only) ─────
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: users, total: users.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/users/pending-count ──────────────────────
router.get('/pending-count', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const count = await User.countDocuments({ status: 'pending' });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/users/:id/approve ─────────────────────
router.patch('/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', rejectedReason: '' },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    res.json({ success: true, data: user, message: `Đã duyệt tài khoản ${user.username}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/users/:id/reject ──────────────────────
router.patch('/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectedReason: reason || '' },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    res.json({ success: true, data: user, message: `Đã từ chối tài khoản ${user.username}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/users/:id ─────────────────────────────
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    res.json({ success: true, message: `Đã xóa tài khoản ${user.username}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
