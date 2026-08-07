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

    res.json({
      success: true,
      data: { byIndustry, byLocation, byLevel, bySource, byStatus, byFit, topSkills, total, newThisWeek },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
