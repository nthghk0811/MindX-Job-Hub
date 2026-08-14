/**
 * procesAndImport.js
 * Đọc 2 file scrape thực → map + lọc + bổ sung trường → import MongoDB
 * Chạy: node scripts/processAndImport.js
 */

require('dotenv').config();
const fs      = require('fs');
const XLSX    = require('xlsx');
const Papa    = require('papaparse');
const mongoose = require('mongoose');
const Job     = require('../models/Job');

// ── Paths ──────────────────────────────────────────────
const XLSX_PATH = 'C:/Users/ADMIN/Downloads/jobsgo-vn-2026-08-11_partial.xlsx';
const CSV_PATH  = 'C:/Users/ADMIN/Downloads/jobs-neu-edu-vn-2026-08-10.csv';

// ── Tiêu chí lọc theo requirements ────────────────────
const VALID_INDUSTRIES = ['Code', 'Data Analysis', 'Business Analysis'];
const VALID_LEVELS     = ['Intern', 'Fresher', 'Junior'];
const VALID_LOCATIONS  = ['Hà Nội', 'TP.HCM', 'Remote', 'Hybrid'];
const VALID_EMP_TYPES  = ['Fulltime', 'Parttime', 'Internship', 'Trainee'];
const VALID_SOURCES    = ['TopCV', 'ITviec', 'LinkedIn', 'VietnamWorks', 'Ybox', 'Facebook Group', 'JobsGo', 'NEU', 'Manual'];

// ── MindX relevant keywords ───────────────────────────
const CODE_KW = [
  'developer', 'engineer', 'frontend', 'backend', 'fullstack', 'full-stack', 'full stack',
  'react', 'node', 'nodejs', 'java', 'kotlin', 'flutter', 'ios', 'android', 'devops',
  'cloud', 'software', 'lập trình', 'phát triển', 'web', 'mobile', 'qa', 'tester',
  'automation', 'embedded', 'unity', 'game', 'python', 'php', 'ruby', '.net', 'angular', 'vue',
  'typescript', 'javascript', 'c++', 'c#', 'blockchain', 'ai engineer', 'ml engineer',
];
const DATA_KW = [
  'data analyst', 'data engineer', 'data science', 'business intelligence', 'bi developer',
  'phân tích dữ liệu', 'data', 'sql', 'tableau', 'powerbi', 'power bi', 'analytics',
  'machine learning', 'ai', 'mlops', 'etl', 'warehouse', 'lakehouse', 'spark', 'airflow',
];
const BA_KW = [
  'business analyst', 'ba ', ' ba', 'phân tích nghiệp vụ', 'product owner', 'product manager',
  'scrum master', 'agile', 'business analysis', 'system analyst', 'functional analyst',
];

// ── Helpers ────────────────────────────────────────────
const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();

function detectIndustry(title, desc, skills) {
  const t = (title + ' ' + desc + ' ' + skills).toLowerCase();
  if (BA_KW.some(k => t.includes(k)))   return 'Business Analysis';
  if (DATA_KW.some(k => t.includes(k))) return 'Data Analysis';
  if (CODE_KW.some(k => t.includes(k))) return 'Code';
  return null; // không match → bỏ qua
}

function detectLevel(title, desc, expRaw) {
  const t = (title + ' ' + desc + ' ' + (expRaw || '')).toLowerCase();
  if (t.includes('intern') || t.includes('thực tập') || t.includes('sinh viên') || t.includes('không yêu cầu kinh nghiệm')) return 'Intern';
  if (t.includes('fresher') || t.includes('fresh graduate') || t.includes('0-1') || t.includes('entry level') || t.includes('mới ra trường')) return 'Fresher';
  if (t.includes('junior') || t.includes('jr.') || t.includes('1-2 năm') || t.includes('1-3 năm') || t.includes('dưới 2 năm')) return 'Junior';
  // Nếu job có keyword intern → Intern
  if (t.includes('intern') || t.includes('trainee')) return 'Intern';
  return null; // không rõ level → bỏ qua
}

function detectLocation(raw) {
  if (!raw) return null;
  const r = clean(raw).toLowerCase();
  if (r.includes('remote'))                                   return 'Remote';
  if (r.includes('hybrid') || r.includes('linh hoạt'))       return 'Hybrid';
  if (r.includes('hcm') || r.includes('hồ chí minh') || r.includes('ho chi minh') || r.includes('sài gòn') || r.includes('saigon') || r.includes('quận') || r.includes('tp.hcm')) return 'TP.HCM';
  if (r.includes('hà nội') || r.includes('ha noi') || r.includes('hanoi') || r.includes('hoàn kiếm') || r.includes('đống đa') || r.includes('cầu giấy') || r.includes('ba đình')) return 'Hà Nội';
  return null; // location khác (Đà Nẵng, Hải Phòng...) → bỏ qua theo yêu cầu
}

function detectEmploymentType(empRaw, level) {
  const r = (empRaw || '').toLowerCase();
  if (r.includes('intern') || r.includes('thực tập')) return 'Internship';
  if (r.includes('trainee'))                           return 'Trainee';
  if (r.includes('part'))                              return 'Parttime';
  if (level === 'Intern')                              return 'Internship';
  return 'Fulltime';
}

function parseDeadline(raw) {
  if (!raw) return '2026-12-31';
  // Format: "28/08/2026 (Còn 17 ngày)" hoặc "18/06/2026"
  const match = clean(raw).match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
  if (match) {
    const [, d, m, y] = match;
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }
  return '2026-12-31';
}

function extractSkills(text) {
  const SKILLS_DICT = [
    'ReactJS','React Native','Next.js','Vue.js','Angular','TypeScript','JavaScript','HTML5','CSS3',
    'Node.js','Express','NestJS','GraphQL','REST API','Python','Django','Flask','FastAPI',
    'Java','Spring Boot','Kotlin','C#','.NET','PHP','Laravel','Ruby','Rails',
    'Flutter','Swift','Android','iOS','React Native','Expo',
    'SQL','MySQL','PostgreSQL','MongoDB','Redis','Elasticsearch','Oracle',
    'Docker','Kubernetes','AWS','GCP','Azure','CI/CD','Git','Linux','Nginx',
    'PowerBI','Tableau','Excel','Pandas','Spark','Airflow','ETL','Machine Learning','Sklearn',
    'BPMN','Figma','Jira','Confluence','Agile','Scrum','User Stories',
    'Selenium','JUnit','Jest','Testing','Postman',
    'Blockchain','Solidity','Web3',
  ];
  const found = new Set();
  const t = text.toLowerCase();
  SKILLS_DICT.forEach(s => {
    if (t.includes(s.toLowerCase())) found.add(s);
  });
  return [...found];
}

const MINDX_SKILLS_MAP = {
  'Code':              ['ReactJS','Node.js','JavaScript','TypeScript','Python','MongoDB','Express','Next.js','Git','Docker','MySQL','PostgreSQL','REST API'],
  'Data Analysis':     ['SQL','Python','PowerBI','Tableau','Excel','Pandas','Machine Learning','ETL'],
  'Business Analysis': ['BPMN','User Stories','SQL','Figma','Agile','Scrum'],
};
function calcFitScore(skills, industry) {
  const ref = (MINDX_SKILLS_MAP[industry] || []).map(s => s.toLowerCase());
  const sl  = skills.map(s => s.toLowerCase());
  const matches = sl.filter(s => ref.some(r => s.includes(r) || r.includes(s))).length;
  const ratio = skills.length > 0 ? matches / Math.max(skills.length, 3) : 0;
  if (ratio >= 0.45) return 'High';
  if (ratio >= 0.15) return 'Medium';
  return 'Low';
}

// ═══════════════════════════════════════════════════════
// PROCESS FILE 1: JobsGo XLSX (1479 rows)
// ═══════════════════════════════════════════════════════
function processJobsGo() {
  console.log('\n📂 Đọc JobsGo XLSX...');
  const wb   = XLSX.readFile(XLSX_PATH);
  const ws   = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
  console.log(`   Raw rows: ${rows.length}`);

  const results = [];
  let skipped = 0;

  rows.forEach((row, i) => {
    const title   = clean(row['title'] || row['item_page_title'] || '');
    const desc    = clean(row['job_description'] || '');
    const reqs    = clean(row['job_requirements'] || '');
    const company = clean(row['company_name'] || row['name'] || row['name_1'] || '');
    const locRaw  = clean(row['addressLocality'] || row['addressLocality_1'] || row['addressLocality_2'] || row['company_address'] || '');
    const url     = clean(row['item_page_link'] || '');
    const empRaw  = clean(row['data6'] || '');
    const indRaw  = clean(row['industry'] || '');
    const expRaw  = clean(row['monthsOfExperience'] || '');
    const deadlineRaw = clean(row['application_deadline'] || '');
    const salary  = clean(row['data5'] || row['data4'] || 'Thỏa thuận');
    const benefits = clean(row['benefits'] || '');
    const posted  = clean(row['posted_time'] || '');

    // === Lọc theo requirements ===
    if (!title || !company) { skipped++; return; }

    const industry = detectIndustry(title, desc + ' ' + reqs, indRaw);
    if (!industry) { skipped++; return; } // Không phải Code/Data/BA → bỏ

    const level = detectLevel(title, desc + ' ' + reqs, expRaw);
    if (!level) { skipped++; return; } // Không phải Intern/Fresher/Junior → bỏ

    const location = detectLocation(locRaw);
    if (!location) { skipped++; return; } // Không phải HN/HCM/Remote/Hybrid → bỏ

    const employmentType = detectEmploymentType(empRaw, level);
    const skills = extractSkills(title + ' ' + desc + ' ' + reqs);
    const deadline = parseDeadline(deadlineRaw);
    const website = clean(row['data2'] || row['data_4'] || '').replace(/^http\s+/, '').trim() || 'https://jobsgo.vn';

    // Bỏ job hết hạn xa trong quá khứ
    if (deadline < '2026-08-01') { skipped++; return; }

    results.push({
      companyName:    company,
      companyLogo:    clean(row['image'] || row['image_3'] || ''),
      website,
      title,
      industry,
      level,
      location,
      employmentType,
      description:    desc || reqs || 'Xem link JD gốc',
      requirements:   reqs || desc,
      skills,
      salary:         salary !== 'Thỏa thuận' ? salary : 'Thỏa thuận',
      salaryMin:      null,
      salaryMax:      null,
      benefits,
      deadline,
      originalUrl:    url || `https://jobsgo.vn/job-${Date.now()}-${i}`,
      source:         'JobsGo',
      scrapedAt:      '2026-08-11',
      status:         'Chưa xác minh',
      mindxFitScore:  calcFitScore(skills, industry),
      ssNotes:        '',
    });
  });

  console.log(`   ✅ Hợp lệ: ${results.length} | ❌ Bỏ qua: ${skipped}`);
  return results;
}

// ═══════════════════════════════════════════════════════
// PROCESS FILE 2: NEU CSV (548 rows)
// ═══════════════════════════════════════════════════════
function processNEU() {
  console.log('\n📂 Đọc NEU CSV...');
  const content = fs.readFileSync(CSV_PATH, 'utf8');
  const { data: rows } = Papa.parse(content, { header: true, skipEmptyLines: true });
  console.log(`   Raw rows: ${rows.length}`);

  const results = [];
  let skipped = 0;

  rows.forEach((row, i) => {
    const title   = clean(row['data'] || row['item_page_title'] || '');
    const desc    = clean(row['Job_Description'] || row['Job_Description_1'] || '');
    const reqs    = clean(row['Candidate_Requirements'] || row['Requirements'] || row['Requirements_1'] || '');
    // Company_Name_1 thường chứa title job → bỏ, ưu tiên các cột khác
    const company = clean(
      row['Company_Name']   ||
      row['Company_Name_2'] ||
      row['Company_Name_3'] ||
      'Không rõ công ty'
    );
    const locRaw  = clean(row['Work_Location'] || row['data3'] || row['data_3'] || '');
    const url     = clean(row['item_page_link'] || '');
    const empRaw  = clean(row['data6'] || row['data_2'] || '');
    const expRaw  = clean(row['Experience_Required'] || '');
    const deadlineRaw = clean(row['Application_Deadline'] || row['Applications'] || '');
    const salary  = clean(row['phone'] || row['phone_1'] || 'Thỏa thuận');
    const benefits = clean(row['Benefits'] || '');

    if (!title) { skipped++; return; }

    // Lấy company từ URL nếu cột trống
    const companyFinal = company || 'Không rõ công ty';

    const industry = detectIndustry(title, desc + ' ' + reqs, '');
    if (!industry) { skipped++; return; }

    const level = detectLevel(title, desc + ' ' + reqs, expRaw);
    if (!level) { skipped++; return; }

    // NEU jobs mostly in Hà Nội; nếu location trống → Hà Nội
    const locationRaw = locRaw || 'Hà Nội';
    const location = detectLocation(locationRaw) || 'Hà Nội';

    const employmentType = detectEmploymentType(empRaw, level);
    const skills = extractSkills(title + ' ' + desc + ' ' + reqs);
    const deadline = parseDeadline(deadlineRaw);

    // Bỏ job hết hạn
    if (deadline < '2026-08-01') { skipped++; return; }

    const websiteRaw = clean(row['data2'] || row['data_4'] || '').replace(/^http\s+https?:\/\//, 'https://').replace(/^http\s+/, '');

    results.push({
      companyName:    companyFinal,
      companyLogo:    clean(row['image'] || row['image_1'] || ''),
      website:        websiteRaw || 'https://jobs.neu.edu.vn',
      title,
      industry,
      level,
      location,
      employmentType,
      description:    desc || reqs || 'Xem link JD gốc',
      requirements:   reqs || desc,
      skills,
      salary,
      salaryMin:      null,
      salaryMax:      null,
      benefits,
      deadline,
      originalUrl:    url || `https://jobs.neu.edu.vn/job-${Date.now()}-${i}`,
      source:         'NEU',
      scrapedAt:      '2026-08-10',
      status:         'Chưa xác minh',
      mindxFitScore:  calcFitScore(skills, industry),
      ssNotes:        '',
    });
  });

  console.log(`   ✅ Hợp lệ: ${results.length} | ❌ Bỏ qua: ${skipped}`);
  return results;
}

// ═══════════════════════════════════════════════════════
// IMPORT TO MONGODB
// ═══════════════════════════════════════════════════════
async function importToMongo(allJobs) {
  console.log(`\n🔌 Kết nối MongoDB Atlas...`);
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Kết nối thành công!');

  let inserted = 0, skippedDup = 0, errCount = 0;

  for (const job of allJobs) {
    try {
      await Job.create(job);
      inserted++;
    } catch (e) {
      if (e.code === 11000) skippedDup++;
      else { errCount++; if (errCount <= 3) console.error('  ERR:', e.message.slice(0, 80)); }
    }
  }

  await mongoose.disconnect();
  return { inserted, skippedDup, errCount };
}

// ── MAIN ───────────────────────────────────────────────
async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  MindX Job Hub — Import Real Scraped Data');
  console.log('═══════════════════════════════════════════════════');

  const jobsGoJobs = processJobsGo();
  const neuJobs    = processNEU();
  const allJobs    = [...jobsGoJobs, ...neuJobs];

  console.log(`\n📊 TỔNG HỢP SAU LỌC:`);
  console.log(`   JobsGo:  ${jobsGoJobs.length} jobs`);
  console.log(`   NEU:     ${neuJobs.length} jobs`);
  console.log(`   TỔNG:    ${allJobs.length} jobs`);

  // Thống kê phân bổ
  const stat = (key) => allJobs.reduce((acc, j) => { acc[j[key]] = (acc[j[key]]||0)+1; return acc; }, {});
  console.log('\n  Theo Ngành:',    JSON.stringify(stat('industry')));
  console.log('  Theo Level:',     JSON.stringify(stat('level')));
  console.log('  Theo Địa điểm:', JSON.stringify(stat('location')));
  console.log('  Theo Fit Score:', JSON.stringify(stat('mindxFitScore')));

  if (allJobs.length === 0) { console.log('\n❌ Không có job nào hợp lệ!'); process.exit(1); }

  const { inserted, skippedDup, errCount } = await importToMongo(allJobs);

  console.log('\n🎉 KẾT QUẢ IMPORT:');
  console.log(`   ✅ Inserted:          ${inserted}`);
  console.log(`   ⏭️  Trùng URL (skip):  ${skippedDup}`);
  console.log(`   ❌ Lỗi:               ${errCount}`);
  console.log('═══════════════════════════════════════════════════');
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
