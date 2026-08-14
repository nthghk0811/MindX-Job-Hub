const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const sampleStudents = [
  {
    fullName: 'Nguyễn Văn An',
    course: 'Fullstack Web K70 (Hà Nội)',
    industry: 'Code',
    skills: 'ReactJS, Node.js, TypeScript, MongoDB, Express, Git',
    preferredLocation: 'Hà Nội',
    expectedSalary: '4.000.000 - 6.000.000 VNĐ',
    cvLink: 'https://drive.google.com/file/d/sample-cv-an/view',
  },
  {
    fullName: 'Trần Thị Minh Anh',
    course: 'Data Analysis Professional K18 (TP.HCM)',
    industry: 'Data Analysis',
    skills: 'SQL, PowerBI, Python, Excel Advanced, Tableau, DAX',
    preferredLocation: 'TP.HCM',
    expectedSalary: '5.000.000 - 8.000.000 VNĐ',
    cvLink: 'https://drive.google.com/file/d/sample-cv-minhanh/view',
  },
  {
    fullName: 'Lê Hoàng Nam',
    course: 'Business Analysis K12 (Hà Nội)',
    industry: 'Business Analysis',
    skills: 'Business Analysis, BPMN, Jira, Confluence, User Stories, SQL',
    preferredLocation: 'Hà Nội',
    expectedSalary: '8.000.000 - 12.000.000 VNĐ',
    cvLink: 'https://drive.google.com/file/d/sample-cv-hoangnam/view',
  },
  {
    fullName: 'Phạm Đức Huy',
    course: 'Python & Data Science K15 (Hà Nội)',
    industry: 'Code',
    skills: 'Python, FastAPI, Django, Docker, PostgreSQL, Git',
    preferredLocation: 'Hà Nội',
    expectedSalary: '4.000.000 - 7.000.000 VNĐ',
    cvLink: 'https://drive.google.com/file/d/sample-cv-duchuy/view',
  },
  {
    fullName: 'Võ Thanh Hà',
    course: 'Data Analytics K20 (TP.HCM)',
    industry: 'Data Analysis',
    skills: 'PowerBI, SQL, Python, Excel, ETL Pipeline, Tableau',
    preferredLocation: 'TP.HCM',
    expectedSalary: '4.000.000 - 6.000.000 VNĐ',
    cvLink: 'https://drive.google.com/file/d/sample-cv-thanhha/view',
  },
  {
    fullName: 'Đặng Quốc Bảo',
    course: 'React Native & Mobile App K8 (Remote)',
    industry: 'Code',
    skills: 'React Native, JavaScript, TypeScript, REST API, Redux',
    preferredLocation: 'Remote',
    expectedSalary: '5.000.000 - 8.000.000 VNĐ',
    cvLink: 'https://drive.google.com/file/d/sample-cv-quocbao/view',
  },
];

const ws = XLSX.utils.json_to_sheet(sampleStudents);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'HocVien');

ws['!cols'] = [
  { wch: 22 }, // fullName
  { wch: 38 }, // course
  { wch: 18 }, // industry
  { wch: 45 }, // skills
  { wch: 15 }, // preferredLocation
  { wch: 28 }, // expectedSalary
  { wch: 45 }, // cvLink
];

const pubXlsx = path.join(__dirname, '../public/sample-students.xlsx');
const pubCsv = path.join(__dirname, '../public/sample-students.csv');

XLSX.writeFile(wb, pubXlsx);
const csv = XLSX.utils.sheet_to_csv(ws);
fs.writeFileSync(pubCsv, '\uFEFF' + csv, 'utf8');

console.log('✅ Created sample student files in public/');
