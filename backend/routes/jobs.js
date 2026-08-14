const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const Papa = require('papaparse');
const Job = require('../models/Job');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ── Helper: build filter query from params ─────────────
function buildQuery(query) {
  const q = {};
  if (query.keyword) {
    q.$text = { $search: query.keyword };
  }
  if (query.industry)  q.industry  = { $in: query.industry.split(',') };
  if (query.level)     q.level     = { $in: query.level.split(',') };
  if (query.location)  q.location  = { $in: query.location.split(',') };
  if (query.source)    q.source    = { $in: query.source.split(',') };
  if (query.status)    q.status    = { $in: query.status.split(',') };
  if (query.fitScore)  q.mindxFitScore = { $in: query.fitScore.split(',') };
  if (query.employmentType) q.employmentType = { $in: query.employmentType.split(',') };

  // Skills filter (OR: job có ít nhất 1 trong các skill)
  if (query.skills) q.skills = { $in: query.skills.split(',') };

  // Salary range filter
  if (query.salaryMin) q.salaryMin = { $gte: Number(query.salaryMin) };
  if (query.salaryMax) q.salaryMax = { $lte: Number(query.salaryMax) };

  // Deadline filter
  if (query.deadlineBefore) q.deadline = { $lte: query.deadlineBefore };

  return q;
}

// ── GET /api/jobs — Danh sách có filter + pagination ───
router.get('/', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(500, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const query = buildQuery(req.query);
    const sort  = req.query.sort === 'deadline' ? { deadline: 1 } : { createdAt: -1 };

    const [jobs, total] = await Promise.all([
      Job.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Job.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: jobs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/jobs/duplicates — Phát hiện trùng lặp ────
router.get('/duplicates', async (req, res) => {
  try {
    const jobs = await Job.find({}).lean();
    const pairs = [];
    const seen = new Set();

    for (let i = 0; i < jobs.length; i++) {
      for (let j = i + 1; j < jobs.length; j++) {
        const a = jobs[i], b = jobs[j];
        const key = [a._id, b._id].sort().join('|');
        if (seen.has(key)) continue;

        // Trùng URL
        if (a.originalUrl && b.originalUrl && a.originalUrl === b.originalUrl) {
          seen.add(key);
          pairs.push({ jobA: a, jobB: b, reason: `Trùng URL JD gốc`, confidence: 100 });
          continue;
        }

        // Trùng company + title (exact, lowercase)
        const aKey = `${a.companyName.toLowerCase()}|${a.title.toLowerCase()}`;
        const bKey = `${b.companyName.toLowerCase()}|${b.title.toLowerCase()}`;
        if (aKey === bKey) {
          seen.add(key);
          pairs.push({ jobA: a, jobB: b, reason: `Trùng Tên công ty + Vị trí`, confidence: 95 });
          continue;
        }

        // Similarity: same company, title overlap ≥ 60%
        if (a.companyName.toLowerCase() === b.companyName.toLowerCase()) {
          const aWords = new Set(a.title.toLowerCase().split(/\s+/));
          const bWords = b.title.toLowerCase().split(/\s+/);
          const overlap = bWords.filter(w => aWords.has(w)).length;
          const sim = overlap / Math.max(aWords.size, bWords.length);
          if (sim >= 0.6) {
            seen.add(key);
            pairs.push({ jobA: a, jobB: b, reason: `Cùng công ty, tiêu đề tương tự (${Math.round(sim * 100)}%)`, confidence: Math.round(sim * 90) });
          }
        }
      }
    }

    res.json({ success: true, data: pairs, total: pairs.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/jobs/:id — Chi tiết 1 job ─────────────────
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();
    if (!job) return res.status(404).json({ success: false, message: 'Không tìm thấy job' });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/jobs — Thêm job mới ──────────────────────
router.post('/', async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ success: false, message: err.message });
    if (err.code === 11000) return res.status(409).json({ success: false, message: 'Job với URL này đã tồn tại trong DB' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/jobs/:id — Cập nhật toàn bộ job ──────────
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: 'Không tìm thấy job' });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/jobs/:id/status — Cập nhật trạng thái ──
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: 'Không tìm thấy job' });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/jobs/:id/notes — Cập nhật ghi chú SS ───
router.patch('/:id/notes', async (req, res) => {
  try {
    const { ssNotes } = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, { ssNotes }, { new: true });
    if (!job) return res.status(404).json({ success: false, message: 'Không tìm thấy job' });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/jobs/:id — Xóa job ────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Không tìm thấy job' });
    res.json({ success: true, message: 'Đã xóa job thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/jobs/import — Import Excel/CSV ───────────
router.post('/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Không có file được upload' });

    let rows = [];
    const ext = req.file.originalname.split('.').pop().toLowerCase();

    if (ext === 'csv') {
      const text = req.file.buffer.toString('utf8');
      const result = Papa.parse(text, { header: true, skipEmptyLines: true });
      rows = result.data;
    } else if (['xlsx', 'xls'].includes(ext)) {
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet);
    } else {
      return res.status(400).json({ success: false, message: 'Chỉ hỗ trợ file .xlsx, .xls, .csv' });
    }

    // Map Excel/CSV columns → Job schema
    const VALID_INDUSTRIES = ['Code', 'Data Analysis', 'Business Analysis'];
    const VALID_LEVELS     = ['Intern', 'Fresher', 'Junior'];
    const VALID_LOCATIONS  = ['Hà Nội', 'TP.HCM', 'Remote', 'Hybrid'];
    const VALID_EMP_TYPES  = ['Fulltime', 'Parttime', 'Internship', 'Trainee'];
    const VALID_SOURCES    = ['TopCV', 'ITviec', 'LinkedIn', 'VietnamWorks', 'Ybox', 'Facebook Group', 'Manual'];

    const jobs = rows.map((row, i) => {
      const skills = String(row['skills'] || row['Kỹ năng'] || '').split(',').map(s => s.trim()).filter(Boolean);
      return {
        companyName:    row['companyName']    || row['Tên công ty']    || `Công ty ${i + 1}`,
        website:        row['website']        || row['Website']        || 'https://company.com',
        title:          row['title']          || row['Vị trí']         || 'Chưa có tiêu đề',
        industry:       VALID_INDUSTRIES.includes(row['industry'] || row['Ngành']) ? (row['industry'] || row['Ngành']) : 'Code',
        level:          VALID_LEVELS.includes(row['level'] || row['Level']) ? (row['level'] || row['Level']) : 'Intern',
        location:       VALID_LOCATIONS.includes(row['location'] || row['Địa điểm']) ? (row['location'] || row['Địa điểm']) : 'Hà Nội',
        employmentType: VALID_EMP_TYPES.includes(row['employmentType'] || row['Hình thức']) ? (row['employmentType'] || row['Hình thức']) : 'Internship',
        description:    row['description']   || row['Mô tả']          || '',
        requirements:   row['requirements']  || row['Yêu cầu']        || '',
        skills,
        salary:         row['salary']        || row['Mức lương']      || 'Thỏa thuận',
        benefits:       row['benefits']      || row['Quyền lợi']      || '',
        deadline:       row['deadline']      || row['Deadline']       || '2026-12-31',
        originalUrl:    row['originalUrl']   || row['Link JD']        || `https://manual-import-${Date.now()}-${i}`,
        source:         VALID_SOURCES.includes(row['source'] || row['Nguồn']) ? (row['source'] || row['Nguồn']) : 'Manual',
        scrapedAt:      new Date().toISOString().split('T')[0],
        status:         row['status']        || row['Trạng thái']     || 'Chưa xác minh',
        mindxFitScore:  row['mindxFitScore'] || row['Fit Score']      || 'Medium',
        ssNotes:        row['ssNotes']       || row['Ghi chú SS']     || '',
      };
    });

    // Bulk insert — skip duplicates (unique originalUrl)
    let inserted = 0, skipped = 0;
    const errors = [];
    for (const jobData of jobs) {
      try {
        await Job.create(jobData);
        inserted++;
      } catch (e) {
        if (e.code === 11000) skipped++;
        else errors.push({ job: jobData.title, error: e.message });
      }
    }

    res.json({ success: true, inserted, skipped, errors, total: rows.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
