// Script: Xóa toàn bộ bản ghi source=JobsGo khỏi MongoDB
require('dotenv').config();
const mongoose = require('mongoose');

const Job = require('../models/Job');

async function deleteJobsGo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const count = await Job.countDocuments({ source: 'JobsGo' });
    console.log(`📦 Tìm thấy ${count} bản ghi nguồn JobsGo`);

    const result = await Job.deleteMany({ source: 'JobsGo' });
    console.log(`🗑️  Đã xóa ${result.deletedCount} bản ghi JobsGo`);

    const remaining = await Job.countDocuments();
    console.log(`📊 Còn lại ${remaining} bản ghi trong DB`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

deleteJobsGo();
