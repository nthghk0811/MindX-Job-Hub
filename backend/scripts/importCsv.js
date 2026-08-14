/**
 * Script: Đọc CSV scraped → validate + lọc → import vào MongoDB
 * Chạy: node scripts/importCsv.js <đường_dẫn_file.csv>
 * VD:   node scripts/importCsv.js C:/Users/ADMIN/Desktop/jobs.csv
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const mongoose = require('mongoose');
const Job = require('../models/Job');

// ── Tiêu chí lọc theo requirements ────────────────────
const VALID_INDUSTRIES     = ['Code', 'Data Analysis', 'Business Analysis'];
const VALID_LEVELS         = ['Intern', 'Fresher', 'Junior'];
const VALID_LOCATIONS      = ['Hà Nội', 'TP.HCM', 'Remote', 'Hybrid'];
const VALID_EMP_TYPES      = ['Fulltime', 'Parttime', 'Internship', 'Trainee'];
const VALID_SOURCES        = ['TopCV', 'ITviec', 'LinkedIn', 'VietnamWorks', 'Ybox', 'Facebook Group', 'Manual'];
const VALID_STATUSES       = ['Còn tuyển', 'Hết hạn', 'Chưa xác minh', 'Đã gửi học viên'];
const VALID_FIT_SCORES     = ['High', 'Medium', 'Low'];

// ── Map tên cột linh hoạt (cả tiếng Anh lẫn tiếng Việt) ──
function mapRow(row) {
  const get = (...keys) => {
    for (const k of keys) {
      const val = row[k] || row[k?.toLowerCase()] || row[k?.toUpperCase()];
      if (val !== undefined && val !== '') return String(val).trim();
    }
    return '';
  };

  const skillsRaw = get('skills', 'Kỹ năng', 'Skills', 'skill', 'technologies', 'tech_stack');
  const skills = skillsRaw
    ? skillsRaw.split(/[,;|\/]/).map(s => s.trim()).filter(Boolean)
    : [];

  // Auto-detect industry từ title + skills nếu cột không có
  const title = get('title', 'Vị trí', 'position', 'job_title', 'Title');
  const rawIndustry = get('industry', 'Ngành', 'Industry', 'category');
  const industry = normalizeIndustry(rawIndustry, title, skills);

  // Auto-detect level từ title nếu cột không có
  const rawLevel = get('level', 'Level', 'Cấp độ');
  const level = normalizeLevel(rawLevel, title);

  // Auto-detect location
  const rawLocation = get('location', 'Địa điểm', 'Location', 'city', 'work_location');
  const location = normalizeLocation(rawLocation);

  const rawEmpType = get('employmentType', 'employment_type', 'Hình thức', 'job_type', 'type');
  const employmentType = normalizeEmploymentType(rawEmpType, level);

  const rawSource = get('source', 'Nguồn', 'Source', 'platform');
  const source = normalizeSource(rawSource);

  const salary = get('salary', 'Mức lương', 'Salary', 'compensation', 'stipend') || 'Thỏa thuận';
  const { salaryMin, salaryMax } = parseSalary(salary);

  return {
    companyName:    get('companyName', 'company_name', 'company', 'Tên công ty', 'Company'),
    website:        get('website', 'Website', 'company_url', 'company_website') || 'https://company.com',
    title,
    industry,
    level,
    location,
    employmentType,
    description:    get('description', 'Mô tả', 'Description', 'job_description', 'desc') || 'Xem link JD gốc',
    requirements:   get('requirements', 'Yêu cầu', 'Requirements', 'requirement') || '',
    skills,
    salary,
    salaryMin,
    salaryMax,
    benefits:       get('benefits', 'Quyền lợi', 'Benefits', 'benefit') || '',
    deadline:       get('deadline', 'Deadline', 'application_deadline', 'Hạn nộp') || '2026-12-31',
    originalUrl:    get('originalUrl', 'original_url', 'url', 'URL', 'Link JD', 'link', 'job_url'),
    source,
    scrapedAt:      get('scrapedAt', 'scraped_at', 'date', 'Date', 'Ngày thu thập') || new Date().toISOString().split('T')[0],
    status:         'Chưa xác minh',   // mặc định khi import
    mindxFitScore:  calcFitScore(skills, industry),
    ssNotes:        get('ssNotes', 'notes', 'Notes', 'Ghi chú') || '',
  };
}

// ── Normalize helpers ──────────────────────────────────
function normalizeIndustry(raw, title, skills) {
  if (VALID_INDUSTRIES.includes(raw)) return raw;

  const t = (title + ' ' + skills.join(' ')).toLowerCase();
  const BA_KEYWORDS = ['business analyst', 'ba ', 'phân tích nghiệp vụ', 'product owner', 'po ', 'scrum'];
  const DATA_KEYWORDS = ['data', 'sql', 'tableau', 'powerbi', 'power bi', 'analyst', 'python', 'machine learning', 'ml', 'bi ', 'etl'];
  const CODE_KEYWORDS = ['developer', 'engineer', 'frontend', 'backend', 'fullstack', 'react', 'node', 'java', 'kotlin', 'flutter', 'ios', 'android', 'devops', 'cloud', 'software'];

  if (BA_KEYWORDS.some(k => t.includes(k))) return 'Business Analysis';
  if (DATA_KEYWORDS.some(k => t.includes(k))) return 'Data Analysis';
  if (CODE_KEYWORDS.some(k => t.includes(k))) return 'Code';
  return 'Code'; // default
}

function normalizeLevel(raw, title) {
  if (VALID_LEVELS.includes(raw)) return raw;
  const t = (raw + ' ' + title).toLowerCase();
  if (t.includes('intern') || t.includes('thực tập')) return 'Intern';
  if (t.includes('fresher') || t.includes('fresh') || t.includes('graduate') || t.includes('entry')) return 'Fresher';
  if (t.includes('junior') || t.includes('jr.') || t.includes('jr ')) return 'Junior';
  return 'Intern'; // default nếu không detect được
}

function normalizeLocation(raw) {
  if (!raw) return 'Hà Nội';
  const r = raw.toLowerCase();
  if (r.includes('remote'))                             return 'Remote';
  if (r.includes('hybrid') || r.includes('flexible'))  return 'Hybrid';
  if (r.includes('hcm') || r.includes('ho chi minh') || r.includes('hồ chí minh') || r.includes('sài gòn') || r.includes('saigon')) return 'TP.HCM';
  if (r.includes('hà nội') || r.includes('ha noi') || r.includes('hanoi')) return 'Hà Nội';
  if (VALID_LOCATIONS.includes(raw)) return raw;
  return 'Hà Nội'; // default
}

function normalizeEmploymentType(raw, level) {
  if (VALID_EMP_TYPES.includes(raw)) return raw;
  const r = (raw || '').toLowerCase();
  if (r.includes('intern') || r.includes('thực tập')) return 'Internship';
  if (r.includes('trainee') || r.includes('học việc'))  return 'Trainee';
  if (r.includes('part') || r.includes('bán thời gian')) return 'Parttime';
  if (level === 'Intern') return 'Internship';
  return 'Fulltime';
}

function normalizeSource(raw) {
  if (!raw) return 'Manual';
  const r = raw.toLowerCase();
  if (r.includes('topcv'))         return 'TopCV';
  if (r.includes('itviec'))        return 'ITviec';
  if (r.includes('linkedin'))      return 'LinkedIn';
  if (r.includes('vietnam') || r.includes('vw')) return 'VietnamWorks';
  if (r.includes('ybox'))          return 'Ybox';
  if (r.includes('facebook'))      return 'Facebook Group';
  if (VALID_SOURCES.includes(raw)) return raw;
  return 'Manual';
}

function parseSalary(str) {
  const nums = str.replace(/[.,]/g, '').match(/\d+/g);
  if (!nums || nums.length === 0) return { salaryMin: null, salaryMax: null };
  const values = nums.map(Number).map(n => n > 1000 ? Math.round(n / 1000000) : n); // convert VND → triệu
  return { salaryMin: Math.min(...values) || null, salaryMax: Math.max(...values) || null };
}

// ── Tính MindX Fit Score dựa trên skills ─────────────
const MINDX_SKILLS = {
  Code: ['ReactJS', 'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'MongoDB', 'Express', 'Next.js', 'HTML', 'CSS', 'Git', 'REST API', 'Docker', 'MySQL', 'PostgreSQL'],
  'Data Analysis': ['SQL', 'Python', 'PowerBI', 'Tableau', 'Excel', 'Pandas', 'Statistics', 'Data Analysis', 'ETL'],
  'Business Analysis': ['BPMN', 'User Stories', 'SQL', 'Figma', 'Agile', 'Scrum', 'Business Analysis', 'Requirements'],
};

function calcFitScore(skills, industry) {
  const ref = MINDX_SKILLS[industry] || MINDX_SKILLS['Code'];
  const skillsLower = skills.map(s => s.toLowerCase());
  const refLower = ref.map(s => s.toLowerCase());
  const matches = skillsLower.filter(s => refLower.some(r => s.includes(r) || r.includes(s))).length;
  const ratio = skills.length > 0 ? matches / Math.max(skills.length, 3) : 0;
  if (ratio >= 0.5) return 'High';
  if (ratio >= 0.2) return 'Medium';
  return 'Low';
}

// ── Validate một row ───────────────────────────────────
function validateRow(job, rowIndex) {
  const errors = [];
  if (!job.companyName)  errors.push('Thiếu tên công ty');
  if (!job.title)        errors.push('Thiếu vị trí tuyển dụng');
  if (!job.originalUrl)  errors.push('Thiếu link JD gốc');
  if (!VALID_INDUSTRIES.includes(job.industry))     errors.push(`Ngành không hợp lệ: "${job.industry}"`);
  if (!VALID_LEVELS.includes(job.level))            errors.push(`Level không hợp lệ: "${job.level}"`);
  if (!VALID_LOCATIONS.includes(job.location))      errors.push(`Địa điểm không hợp lệ: "${job.location}"`);
  return errors;
}

// ── MAIN ───────────────────────────────────────────────
async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('❌ Cú pháp: node scripts/importCsv.js <đường_dẫn_file.csv>');
    process.exit(1);
  }
  if (!fs.existsSync(csvPath)) {
    console.error('❌ Không tìm thấy file:', csvPath);
    process.exit(1);
  }

  console.log('📂 Đọc file:', csvPath);
  const content = fs.readFileSync(csvPath, 'utf8');
  const { data: rows, errors: parseErrors } = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
    encoding: 'utf8',
  });
  console.log(`📊 Tổng rows đọc được: ${rows.length}`);
  if (parseErrors.length > 0) console.warn('⚠️  Parse warnings:', parseErrors.slice(0, 3));

  // Map + validate
  const validJobs = [];
  const skippedRows = [];

  rows.forEach((row, i) => {
    const job = mapRow(row);
    const errors = validateRow(job, i + 2);
    if (errors.length > 0) {
      skippedRows.push({ row: i + 2, title: job.title || '(trống)', errors });
    } else {
      validJobs.push(job);
    }
  });

  // Print summary trước khi import
  console.log('\n══════════════════════════════════════════');
  console.log('📋 KẾT QUẢ VALIDATE:');
  console.log(`  ✅ Hợp lệ:    ${validJobs.length} jobs`);
  console.log(`  ❌ Bỏ qua:    ${skippedRows.length} rows`);

  // Thống kê phân bổ
  const byIndustry = {}, byLevel = {}, byLocation = {};
  validJobs.forEach(j => {
    byIndustry[j.industry]  = (byIndustry[j.industry]  || 0) + 1;
    byLevel[j.level]        = (byLevel[j.level]        || 0) + 1;
    byLocation[j.location]  = (byLocation[j.location]  || 0) + 1;
  });
  console.log('\n  📦 Theo Ngành:');
  Object.entries(byIndustry).forEach(([k, v]) => console.log(`     ${k}: ${v}`));
  console.log('\n  📦 Theo Level:');
  Object.entries(byLevel).forEach(([k, v]) => console.log(`     ${k}: ${v}`));
  console.log('\n  📦 Theo Địa điểm:');
  Object.entries(byLocation).forEach(([k, v]) => console.log(`     ${k}: ${v}`));

  if (skippedRows.length > 0) {
    console.log('\n  ⚠️  Rows bị bỏ qua (10 đầu):');
    skippedRows.slice(0, 10).forEach(r => console.log(`     Row ${r.row}: "${r.title}" → ${r.errors.join(', ')}`));
  }
  console.log('══════════════════════════════════════════');

  if (validJobs.length === 0) {
    console.log('\n❌ Không có job nào hợp lệ để import!');
    process.exit(1);
  }

  // Kết nối MongoDB và import
  console.log('\n🔌 Đang kết nối MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Kết nối thành công!');

  let inserted = 0, skippedDup = 0;
  const importErrors = [];

  for (const job of validJobs) {
    try {
      await Job.create(job);
      inserted++;
    } catch (e) {
      if (e.code === 11000) {
        skippedDup++;
      } else {
        importErrors.push({ title: job.title, error: e.message });
      }
    }
  }

  console.log('\n🎉 IMPORT HOÀN TẤT:');
  console.log(`  ✅ Inserted:         ${inserted}`);
  console.log(`  ⏭️  Trùng URL (skip): ${skippedDup}`);
  console.log(`  ❌ Lỗi khác:         ${importErrors.length}`);
  if (importErrors.length > 0) {
    importErrors.slice(0, 5).forEach(e => console.log(`     "${e.title}": ${e.error}`));
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
