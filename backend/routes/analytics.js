const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// GET /api/analytics/summary
router.get('/summary', async (_req, res) => {
  try {
    const [byIndustry, byLocation, byLevel, bySource, byStatus, byFit, topSkills, total] = await Promise.all([
      Job.aggregate([{ $group: { _id: '$industry', count: { $sum: 1 } } }]),
      Job.aggregate([{ $group: { _id: '$location', count: { $sum: 1 } } }]),
      Job.aggregate([{ $group: { _id: '$level',    count: { $sum: 1 } } }]),
      Job.aggregate([{ $group: { _id: '$source',   count: { $sum: 1 } } }]),
      Job.aggregate([{ $group: { _id: '$status',   count: { $sum: 1 } } }]),
      Job.aggregate([{ $group: { _id: '$mindxFitScore', count: { $sum: 1 } } }]),
      Job.aggregate([
        { $unwind: '$skills' },
        { $group: { _id: '$skills', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Job.countDocuments(),
    ]);

    const newThisWeek = await Job.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // ── Phân tích theo tuần (8 tuần gần nhất) ──────────
    const eightWeeksAgo = new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000);
    const weeklyRaw = await Job.aggregate([
      { $match: { createdAt: { $gte: eightWeeksAgo } } },
      {
        $group: {
          _id: {
            week: { $isoWeek: '$createdAt' },
            year: { $isoWeekYear: '$createdAt' },
          },
          count: { $sum: 1 },
          // Get the Monday of that week for label
          firstDate: { $min: '$createdAt' },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
    ]);

    // Format label: "Tuần 32 (04/08)"
    const byWeek = weeklyRaw.map((w) => {
      const d = new Date(w.firstDate);
      // Get Monday of that ISO week
      const day = d.getDay(); // 0=Sun, 1=Mon...
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff));
      const label = `T${w._id.week} (${String(monday.getDate()).padStart(2, '0')}/${String(monday.getMonth() + 1).padStart(2, '0')})`;
      return { week: label, count: w.count };
    });

    res.json({
      success: true,
      data: { byIndustry, byLocation, byLevel, bySource, byStatus, byFit, topSkills, total, newThisWeek, byWeek },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
