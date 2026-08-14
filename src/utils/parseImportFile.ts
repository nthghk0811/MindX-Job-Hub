/**
 * parseImportFile.ts
 * Parse file Excel (.xlsx) hoặc CSV (.csv) từ trình duyệt
 * thành mảng JobItem[] để import vào backend.
 */
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { JobItem, IndustryType, LevelType, LocationType, EmploymentType, SourceType, JobStatusType, FitScoreType } from '../types/job';

// ── Enums cho validation ──────────────────────────────
const VALID_INDUSTRIES: IndustryType[]    = ['Code', 'Data Analysis', 'Business Analysis'];
const VALID_LEVELS: LevelType[]           = ['Intern', 'Fresher', 'Junior'];
const VALID_LOCATIONS: LocationType[]     = ['Hà Nội', 'TP.HCM', 'Remote', 'Hybrid'];
const VALID_EMP_TYPES: EmploymentType[]   = ['Fulltime', 'Parttime', 'Internship', 'Trainee'];
const VALID_SOURCES: SourceType[]         = ['TopCV', 'ITviec', 'LinkedIn', 'VietnamWorks', 'Ybox', 'Facebook Group', 'JobsGo', 'NEU', 'Manual'];
const VALID_STATUSES: JobStatusType[]     = ['Còn tuyển', 'Hết hạn', 'Chưa xác minh', 'Đã gửi học viên'];
const VALID_FIT: FitScoreType[]           = ['High', 'Medium', 'Low'];

// ── Skill extractor đơn giản ──────────────────────────
const SKILLS_DICT = [
  'ReactJS','React Native','Next.js','Vue.js','Angular','TypeScript','JavaScript','HTML5','CSS3',
  'Node.js','Express','NestJS','GraphQL','REST API','Python','Django','Flask','FastAPI',
  'Java','Spring Boot','Kotlin','C#','.NET','PHP','Laravel','Swift','Flutter',
  'SQL','MySQL','PostgreSQL','MongoDB','Redis','Docker','Kubernetes','AWS','GCP','Azure',
  'Git','Linux','CI/CD','PowerBI','Tableau','Excel','Pandas','Spark','Airflow','ETL',
  'Machine Learning','BPMN','Figma','Jira','Confluence','Agile','Scrum','Selenium','Postman',
];

function extractSkillsFromText(text: string): string[] {
  const found = new Set<string>();
  const lower = text.toLowerCase();
  SKILLS_DICT.forEach(s => { if (lower.includes(s.toLowerCase())) found.add(s); });
  return [...found];
}

function calcFitScore(skills: string[], industry: IndustryType): FitScoreType {
  const REF: Record<IndustryType, string[]> = {
    'Code':              ['ReactJS','Node.js','JavaScript','TypeScript','Python','MongoDB','Express','Next.js','Git','Docker','MySQL','PostgreSQL','REST API','Java','C#','.NET'],
    'Data Analysis':     ['SQL','Python','PowerBI','Tableau','Excel','Pandas','Machine Learning','ETL','Spark'],
    'Business Analysis': ['BPMN','User Stories','SQL','Figma','Agile','Scrum','Jira','Confluence'],
  };
  const ref = REF[industry].map(s => s.toLowerCase());
  const sl  = skills.map(s => s.toLowerCase());
  const matches = sl.filter(s => ref.some(r => s.includes(r) || r.includes(s))).length;
  const ratio   = skills.length > 0 ? matches / Math.max(skills.length, 3) : 0;
  if (ratio >= 0.45) return 'High';
  if (ratio >= 0.15) return 'Medium';
  return 'Low';
}

function clean(v: unknown): string {
  return String(v ?? '').replace(/\s+/g, ' ').trim();
}

function coerce<T>(val: string, valid: T[], fallback: T): T {
  return (valid as string[]).includes(val) ? (val as unknown as T) : fallback;
}

// ── Map một raw row sang JobItem ─────────────────────
export interface ParseResult {
  jobs: Omit<JobItem, 'id'>[];
  errors: { row: number; reason: string }[];
}

function mapRow(raw: Record<string, unknown>, rowNum: number, errors: ParseResult['errors']): Omit<JobItem, 'id'> | null {
  const title       = clean(raw['title'] || raw['Title'] || raw['Vị trí tuyển dụng'] || '');
  const companyName = clean(raw['companyName'] || raw['company_name'] || raw['Tên công ty'] || raw['Company'] || '');

  if (!title)       { errors.push({ row: rowNum, reason: 'Thiếu cột "title"' }); return null; }
  if (!companyName) { errors.push({ row: rowNum, reason: 'Thiếu cột "companyName"' }); return null; }

  const industryRaw = clean(raw['industry'] || raw['Ngành'] || '');
  const levelRaw    = clean(raw['level']    || raw['Level'] || '');
  const locationRaw = clean(raw['location'] || raw['Địa điểm'] || '');
  const empRaw      = clean(raw['employmentType'] || raw['Hình thức'] || '');
  const sourceRaw   = clean(raw['source']   || raw['Nguồn'] || 'Manual');
  const statusRaw   = clean(raw['status']   || raw['Trạng thái'] || 'Chưa xác minh');
  const fitRaw      = clean(raw['mindxFitScore'] || raw['Fit Score'] || '');

  const industry     = coerce<IndustryType>(industryRaw, VALID_INDUSTRIES, 'Code');
  const level        = coerce<LevelType>(levelRaw,       VALID_LEVELS,    'Intern');
  const location     = coerce<LocationType>(locationRaw, VALID_LOCATIONS, 'Hà Nội');
  const employmentType = coerce<EmploymentType>(empRaw,  VALID_EMP_TYPES, 'Internship');
  const source       = coerce<SourceType>(sourceRaw,     VALID_SOURCES,   'Manual');
  const status       = coerce<JobStatusType>(statusRaw,  VALID_STATUSES,  'Chưa xác minh');

  const description  = clean(raw['description']  || raw['Mô tả'] || 'Xem link gốc');
  const requirements = clean(raw['requirements'] || raw['Yêu cầu'] || description);
  const skillsRaw    = clean(raw['skills']       || raw['Kỹ năng'] || '');
  const skills       = skillsRaw
    ? skillsRaw.split(/[,;|]+/).map(s => s.trim()).filter(Boolean)
    : extractSkillsFromText(title + ' ' + description + ' ' + requirements);

  const fitScore = fitRaw && (VALID_FIT as string[]).includes(fitRaw)
    ? fitRaw as FitScoreType
    : calcFitScore(skills, industry);

  const deadlineRaw = clean(raw['deadline'] || raw['Deadline'] || '');
  // Chuẩn hoá deadline dd/mm/yyyy → yyyy-mm-dd
  let deadline = deadlineRaw;
  const ddmm = deadlineRaw.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (ddmm) deadline = `${ddmm[3]}-${ddmm[2].padStart(2,'0')}-${ddmm[1].padStart(2,'0')}`;
  if (!deadline) deadline = '2026-12-31';

  return {
    companyName,
    companyLogo: clean(raw['companyLogo'] || raw['Logo'] || ''),
    website:     clean(raw['website'] || raw['Website'] || `https://${companyName.toLowerCase().replace(/\s+/g,'-')}.vn`),
    title,
    industry,
    level,
    location,
    employmentType,
    description,
    requirements,
    skills,
    salary:      clean(raw['salary']   || raw['Lương'] || 'Thỏa thuận'),
    salaryMin:   null,
    salaryMax:   null,
    benefits:    clean(raw['benefits'] || raw['Quyền lợi'] || ''),
    deadline,
    originalUrl: clean(raw['originalUrl'] || raw['Link JD'] || raw['URL'] || `https://mindx-import-${Date.now()}-${rowNum}`),
    source,
    scrapedAt:   new Date().toISOString().split('T')[0],
    status,
    mindxFitScore: fitScore,
    ssNotes:     clean(raw['ssNotes']  || raw['Ghi chú'] || ''),
  };
}

// ── Main export: parse File object ───────────────────
export async function parseImportFile(file: File): Promise<ParseResult> {
  const errors: ParseResult['errors'] = [];
  const jobs: Omit<JobItem, 'id'>[]   = [];

  const ext = file.name.split('.').pop()?.toLowerCase();

  // ── Excel (.xlsx / .xls) ────────────────────────────
  if (ext === 'xlsx' || ext === 'xls') {
    const buffer  = await file.arrayBuffer();
    const wb      = XLSX.read(buffer, { type: 'array' });
    const ws      = wb.Sheets[wb.SheetNames[0]];
    const rows    = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' });

    rows.forEach((row, i) => {
      const job = mapRow(row, i + 2, errors);
      if (job) jobs.push(job);
    });
    return { jobs, errors };
  }

  // ── CSV ──────────────────────────────────────────────
  if (ext === 'csv') {
    const text = await file.text();
    const { data } = Papa.parse<Record<string, unknown>>(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });
    data.forEach((row, i) => {
      const job = mapRow(row, i + 2, errors);
      if (job) jobs.push(job);
    });
    return { jobs, errors };
  }

  return { jobs: [], errors: [{ row: 0, reason: `Định dạng file không hỗ trợ: .${ext}. Vui lòng dùng .xlsx hoặc .csv` }] };
}
