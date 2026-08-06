import { MindXStudent } from '../types/job';

export const INITIAL_MOCK_STUDENTS: MindXStudent[] = [
  {
    id: 'std-001',
    fullName: 'Nguyen Van An',
    course: 'Fullstack Web K70 (Hà Nội)',
    industry: 'Code',
    skills: ['ReactJS', 'Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'Git'],
    preferredLocation: 'Hà Nội',
    expectedSalary: '4.000.000 - 6.000.000 VNĐ',
    cvLink: 'https://drive.google.com/file/d/sample-cv-an/view'
  },
  {
    id: 'std-002',
    fullName: 'Tran Thi Minh Anh',
    course: 'Data Analysis Professional K18 (TP.HCM)',
    industry: 'Data Analysis',
    skills: ['SQL', 'PowerBI', 'Python', 'Excel Advanced', 'Tableau', 'DAX'],
    preferredLocation: 'TP.HCM',
    expectedSalary: '5.000.000 - 8.000.000 VNĐ',
    cvLink: 'https://drive.google.com/file/d/sample-cv-minhanh/view'
  },
  {
    id: 'std-003',
    fullName: 'Le Hoang Nam',
    course: 'Business Analysis K12 (Hà Nội)',
    industry: 'Business Analysis',
    skills: ['Business Analysis', 'BPMN', 'Jira/Confluence', 'User Stories', 'SQL Basic'],
    preferredLocation: 'Hà Nội',
    expectedSalary: '8.000.000 - 12.000.000 VNĐ',
    cvLink: 'https://drive.google.com/file/d/sample-cv-hoangnam/view'
  },
  {
    id: 'std-004',
    fullName: 'Pham Duc Huy',
    course: 'Python & Data Science K15 (Hà Nội)',
    industry: 'Code',
    skills: ['Python', 'FastAPI', 'Django', 'Docker', 'PostgreSQL', 'Git'],
    preferredLocation: 'Hà Nội',
    expectedSalary: '4.000.000 - 7.000.000 VNĐ',
    cvLink: 'https://drive.google.com/file/d/sample-cv-duchuy/view'
  },
  {
    id: 'std-005',
    fullName: 'Vo Thanh Ha',
    course: 'Data Analytics K20 (TP.HCM)',
    industry: 'Data Analysis',
    skills: ['PowerBI', 'SQL', 'Python', 'Excel', 'ETL Pipeline'],
    preferredLocation: 'TP.HCM',
    expectedSalary: '4.000.000 - 6.000.000 VNĐ',
    cvLink: 'https://drive.google.com/file/d/sample-cv-thanhha/view'
  }
];
