/**
 * Script tạo file Excel mẫu 10 jobs để test import
 * Chạy: node scripts/createSampleFile.js
 */
const XLSX = require('xlsx');
const path = require('path');

const sampleJobs = [
  {
    companyName: 'Công ty TNHH Tiki',
    website: 'https://tiki.vn',
    title: 'Thực tập sinh Frontend Developer (ReactJS)',
    industry: 'Code',
    level: 'Intern',
    location: 'TP.HCM',
    employmentType: 'Internship',
    description: 'Tham gia phát triển giao diện người dùng cho ứng dụng thương mại điện tử tiki.vn. Làm việc cùng team Engineering xây dựng các component React hiệu suất cao.',
    requirements: 'Sinh viên năm 3-4 ngành CNTT. Có kiến thức ReactJS, HTML, CSS, JavaScript cơ bản. Biết Git.',
    skills: 'ReactJS, JavaScript, HTML5, CSS3, Git',
    salary: '3.000.000 - 5.000.000 VNĐ/tháng',
    benefits: 'Phụ cấp ăn trưa, xe bus nội bộ, mentoring từ senior dev',
    deadline: '2026-09-30',
    originalUrl: 'https://tiki.vn/careers/frontend-intern-2026',
    source: 'Manual',
    ssNotes: '',
  },
  {
    companyName: 'VNG Corporation',
    website: 'https://vng.com.vn',
    title: 'Fresher Data Analyst – Zalo Analytics Team',
    industry: 'Data Analysis',
    level: 'Fresher',
    location: 'TP.HCM',
    employmentType: 'Fulltime',
    description: 'Phân tích dữ liệu hành vi người dùng Zalo, xây dựng dashboard báo cáo cho Product Team. Làm việc với tập dữ liệu lớn hàng triệu user.',
    requirements: 'Tốt nghiệp CNTT / Toán / Thống kê. Thành thạo SQL. Biết Python cơ bản (Pandas). Ưu tiên biết PowerBI.',
    skills: 'SQL, Python, Pandas, PowerBI, Excel',
    salary: '12.000.000 - 15.000.000 VNĐ/tháng',
    benefits: 'Bảo hiểm sức khỏe cao cấp, thưởng KPI, team building',
    deadline: '2026-09-15',
    originalUrl: 'https://vng.com.vn/careers/data-analyst-zalo',
    source: 'Manual',
    ssNotes: 'Job xịn, phù hợp học viên Data MindX',
  },
  {
    companyName: 'MoMo (M_Service)',
    website: 'https://momo.vn',
    title: 'Junior Business Analyst – Digital Payment',
    industry: 'Business Analysis',
    level: 'Junior',
    location: 'TP.HCM',
    employmentType: 'Fulltime',
    description: 'Phân tích quy trình nghiệp vụ thanh toán điện tử, viết BRD/FRS cho tính năng mới. Làm cầu nối giữa bộ phận kinh doanh và team kỹ thuật.',
    requirements: '1+ năm kinh nghiệm BA hoặc QA. Biết vẽ BPMN, viết user story. Tiếng Anh tốt.',
    skills: 'BPMN, User Stories, SQL, Jira, Confluence, Agile, Scrum',
    salary: '15.000.000 - 20.000.000 VNĐ/tháng',
    benefits: 'Môi trường startup năng động, thưởng theo dự án, cơ hội thăng tiến nhanh',
    deadline: '2026-10-01',
    originalUrl: 'https://momo.vn/careers/junior-ba-2026',
    source: 'Manual',
    ssNotes: '',
  },
  {
    companyName: 'FPT Software',
    website: 'https://fptsoftware.com',
    title: 'Thực tập sinh Backend Developer (Node.js)',
    industry: 'Code',
    level: 'Intern',
    location: 'Hà Nội',
    employmentType: 'Internship',
    description: 'Tham gia phát triển backend cho các hệ thống enterprise. Làm việc với Node.js, REST API, SQL Server.',
    requirements: 'Sinh viên CNTT năm 3-4. Biết JavaScript/Node.js. Hiểu cơ bản về REST API, Database.',
    skills: 'Node.js, Express, JavaScript, SQL, REST API, Git',
    salary: '3.000.000 - 4.000.000 VNĐ/tháng',
    benefits: 'Chứng chỉ thực tập, cơ hội nhận việc chính thức sau tốt nghiệp',
    deadline: '2026-09-20',
    originalUrl: 'https://fptsoftware.com/careers/nodejs-intern',
    source: 'TopCV',
    ssNotes: '',
  },
  {
    companyName: 'Shopee Vietnam',
    website: 'https://shopee.vn',
    title: 'Data Engineer Intern – Big Data Platform',
    industry: 'Data Analysis',
    level: 'Intern',
    location: 'TP.HCM',
    employmentType: 'Internship',
    description: 'Hỗ trợ xây dựng data pipeline, ETL processes trên nền tảng dữ liệu lớn của Shopee. Làm việc với Spark, Airflow, Hive.',
    requirements: 'Sinh viên CNTT/Khoa học dữ liệu. Biết Python. Có kiến thức cơ bản về SQL và Linux. Ưu tiên đã học Big Data.',
    skills: 'Python, SQL, Spark, Airflow, Linux, ETL',
    salary: '5.000.000 - 7.000.000 VNĐ/tháng',
    benefits: 'Allowance cao, mentoring từ data engineer giàu kinh nghiệm',
    deadline: '2026-08-31',
    originalUrl: 'https://careers.shopee.vn/data-engineer-intern',
    source: 'LinkedIn',
    ssNotes: 'Deadline gần, ưu tiên push học viên Data phù hợp',
  },
  {
    companyName: 'Grab Vietnam',
    website: 'https://grab.com/vn',
    title: 'Fresher Mobile Developer (React Native)',
    industry: 'Code',
    level: 'Fresher',
    location: 'Hà Nội',
    employmentType: 'Fulltime',
    description: 'Phát triển ứng dụng mobile cho tài xế và khách hàng sử dụng React Native. Tối ưu performance và UX cho thiết bị tầm trung.',
    requirements: 'Tốt nghiệp CNTT. Có kiến thức React Native hoặc Flutter. Biết Git, RESTful API.',
    skills: 'React Native, JavaScript, TypeScript, REST API, Git',
    salary: '18.000.000 - 22.000.000 VNĐ/tháng',
    benefits: 'Bảo hiểm sức khỏe, free Grab cho nhân viên, học tiếng Anh miễn phí',
    deadline: '2026-10-15',
    originalUrl: 'https://grab.com/vn/careers/react-native-fresher',
    source: 'LinkedIn',
    ssNotes: '',
  },
  {
    companyName: 'Viettel Digital',
    website: 'https://digital.viettel.vn',
    title: 'Intern Business Analyst – Fintech',
    industry: 'Business Analysis',
    level: 'Intern',
    location: 'Hà Nội',
    employmentType: 'Internship',
    description: 'Hỗ trợ phân tích nghiệp vụ cho các sản phẩm Fintech của Viettel. Tham gia viết tài liệu yêu cầu, use case và tham dự các buổi họp với stakeholder.',
    requirements: 'Sinh viên kinh tế, CNTT hoặc liên quan. Có tư duy logic tốt, kỹ năng giao tiếp tốt. Biết Excel.',
    skills: 'Excel, User Stories, BPMN, Agile, Jira',
    salary: '3.000.000 - 4.500.000 VNĐ/tháng',
    benefits: 'Môi trường tập đoàn lớn, cơ hội học hỏi thực tế',
    deadline: '2026-09-10',
    originalUrl: 'https://digital.viettel.vn/careers/intern-ba',
    source: 'Manual',
    ssNotes: '',
  },
  {
    companyName: 'NashTech Vietnam',
    website: 'https://nashtechglobal.com',
    title: 'Junior Fullstack Developer (.NET + ReactJS)',
    industry: 'Code',
    level: 'Junior',
    location: 'Hà Nội',
    employmentType: 'Fulltime',
    description: 'Tham gia phát triển các hệ thống web cho khách hàng quốc tế sử dụng .NET Core backend và ReactJS frontend.',
    requirements: '0-2 năm kinh nghiệm. Biết C# .NET Core, ReactJS. Tiếng Anh đọc hiểu tài liệu kỹ thuật.',
    skills: 'C#, .NET Core, ReactJS, SQL Server, REST API, Git',
    salary: '15.000.000 - 20.000.000 VNĐ/tháng',
    benefits: 'Làm việc với khách hàng nước ngoài, lương cạnh tranh, du lịch thường niên',
    deadline: '2026-10-30',
    originalUrl: 'https://nashtechglobal.com/vn/careers/junior-fullstack',
    source: 'ITviec',
    ssNotes: '',
  },
  {
    companyName: 'KPMG Vietnam',
    website: 'https://kpmg.com/vn',
    title: 'Data Analyst Intern – Advisory Division',
    industry: 'Data Analysis',
    level: 'Intern',
    location: 'Hà Nội',
    employmentType: 'Internship',
    description: 'Hỗ trợ nhóm tư vấn phân tích dữ liệu kinh doanh cho khách hàng doanh nghiệp lớn. Xây dựng dashboard PowerBI và báo cáo Excel nâng cao.',
    requirements: 'Sinh viên kinh tế, tài chính, CNTT năm 3-4. Thành thạo Excel. Biết SQL hoặc PowerBI là lợi thế lớn.',
    skills: 'Excel, PowerBI, SQL, Tableau, Statistics',
    salary: '4.000.000 - 6.000.000 VNĐ/tháng',
    benefits: 'Cơ hội được nhận vào làm chính thức tại Big 4, môi trường chuyên nghiệp quốc tế',
    deadline: '2026-09-05',
    originalUrl: 'https://kpmg.com/vn/careers/data-analyst-intern',
    source: 'Manual',
    ssNotes: 'Big 4 - rất uy tín, nên đẩy cho học viên Data',
  },
  {
    companyName: 'Axon Active Vietnam',
    website: 'https://axonactive.com',
    title: 'Intern Software Developer – Agile Team (Remote)',
    industry: 'Code',
    level: 'Intern',
    location: 'Remote',
    employmentType: 'Internship',
    description: 'Làm việc từ xa trong môi trường Agile/Scrum thực sự cùng team phát triển phần mềm quốc tế. Tham gia sprint planning, daily standup, code review.',
    requirements: 'Biết ít nhất 1 ngôn ngữ lập trình (Java/Python/JS). Có khả năng tự học cao. Thích môi trường remote.',
    skills: 'Java, Python, JavaScript, Git, Agile, Scrum, REST API',
    salary: '4.000.000 - 6.000.000 VNĐ/tháng',
    benefits: 'Remote hoàn toàn, flexible hours, được làm dự án thực tế cho khách hàng Thuỵ Sĩ',
    deadline: '2026-11-30',
    originalUrl: 'https://axonactive.com/careers/intern-software-dev-remote',
    source: 'Manual',
    ssNotes: 'Remote - phù hợp học viên tỉnh xa',
  },
];

// Tạo file Excel
const ws = XLSX.utils.json_to_sheet(sampleJobs);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Jobs');

// Style cột
const colWidths = [
  { wch: 25 }, // companyName
  { wch: 30 }, // website
  { wch: 45 }, // title
  { wch: 18 }, // industry
  { wch: 10 }, // level
  { wch: 10 }, // location
  { wch: 14 }, // employmentType
  { wch: 50 }, // description
  { wch: 50 }, // requirements
  { wch: 35 }, // skills
  { wch: 30 }, // salary
  { wch: 40 }, // benefits
  { wch: 12 }, // deadline
  { wch: 50 }, // originalUrl
  { wch: 12 }, // source
  { wch: 25 }, // ssNotes
];
ws['!cols'] = colWidths;

const outPath = path.join(__dirname, '../sample-jobs.xlsx');
XLSX.writeFile(wb, outPath);
console.log('✅ Đã tạo file mẫu:', outPath);
console.log('   →', sampleJobs.length, 'jobs mẫu');
console.log('   → Columns:', Object.keys(sampleJobs[0]).join(', '));

// Cũng tạo CSV
const csvPath = path.join(__dirname, '../sample-jobs.csv');
const csv = XLSX.utils.sheet_to_csv(ws);
require('fs').writeFileSync(csvPath, '\uFEFF' + csv, 'utf8'); // BOM for Excel UTF-8
console.log('✅ Đã tạo file CSV mẫu:', csvPath);
