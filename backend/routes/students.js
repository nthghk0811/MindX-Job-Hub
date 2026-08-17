const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const authMiddleware = require('../middleware/auth');

// GET all students
router.get('/', async (_req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST single student
router.post('/', authMiddleware, async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST bulk students
router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : req.body.students || [];
    const inserted = await Student.insertMany(items);
    res.status(201).json({ success: true, data: inserted, count: inserted.length });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE student
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa học viên' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
