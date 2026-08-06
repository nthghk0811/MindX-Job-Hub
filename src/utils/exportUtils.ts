import { JobItem } from '../types/job';

export function exportJobsToCSV(jobs: JobItem[], filename = 'mindx_jobs_export.csv') {
  if (jobs.length === 0) return;

  const headers = [
    'ID', 'Tên công ty', 'Website', 'Vị trí', 'Ngành', 'Level', 'Địa điểm',
    'Hình thức', 'Mức lương', 'Deadline', 'Link JD gốc', 'Nguồn', 'Ngày cào',
    'Trạng thái', 'Fit Score', 'Ghi chú SS'
  ];

  const rows = jobs.map(j => [
    `"${j.id}"`,
    `"${j.companyName.replace(/"/g, '""')}"`,
    `"${j.website}"`,
    `"${j.title.replace(/"/g, '""')}"`,
    `"${j.industry}"`,
    `"${j.level}"`,
    `"${j.location}"`,
    `"${j.employmentType}"`,
    `"${j.salary}"`,
    `"${j.deadline}"`,
    `"${j.originalUrl}"`,
    `"${j.source}"`,
    `"${j.scrapedAt}"`,
    `"${j.status}"`,
    `"${j.mindxFitScore}"`,
    `"${j.ssNotes.replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateWeeklyNewsletter(jobs: JobItem[]): string {
  const activeJobs = jobs.filter(j => j.status === 'Còn tuyển');
  const codeJobs = activeJobs.filter(j => j.industry === 'Code');
  const dataJobs = activeJobs.filter(j => j.industry === 'Data Analysis');
  const baJobs = activeJobs.filter(j => j.industry === 'Business Analysis');

  return `# 🚀 BẢN TIN JOB TUẦN DÀNH CHO HỌC VIÊN MINDX (${new Date().toLocaleDateString('vi-VN')})

Thân gửi các bạn học viên MindX,
Dưới đây là tổng hợp các cơ hội việc làm Intern / Fresher hot nhất tuần này do Team Student Success lọc và xác minh!

---

## 💻 1. KHỐI LẬP TRÌNH (CODE / SOFTWARE DEVELOPMENT)
${codeJobs.map(j => `- **[${j.level}] ${j.title}** - *${j.companyName}* (${j.location})
  💰 Lương: ${j.salary} | ⏳ Hạn nộp: ${j.deadline}
  📌 Kỹ năng: ${j.skills.join(', ')}
  👉 Link ứng tuyển: ${j.originalUrl}`).join('\n\n')}

---

## 📊 2. KHỐI DỮ LIỆU (DATA ANALYSIS & DATA SCIENCE)
${dataJobs.map(j => `- **[${j.level}] ${j.title}** - *${j.companyName}* (${j.location})
  💰 Lương: ${j.salary} | ⏳ Hạn nộp: ${j.deadline}
  📌 Kỹ năng: ${j.skills.join(', ')}
  👉 Link ứng tuyển: ${j.originalUrl}`).join('\n\n')}

---

## 📋 3. KHỐI BUSINESS ANALYSIS (BA)
${baJobs.map(j => `- **[${j.level}] ${j.title}** - *${j.companyName}* (${j.location})
  💰 Lương: ${j.salary} | ⏳ Hạn nộp: ${j.deadline}
  📌 Kỹ năng: ${j.skills.join(', ')}
  👉 Link ứng tuyển: ${j.originalUrl}`).join('\n\n')}

---
*Chúc các bạn học viên MindX ứng tuyển thành công! Team SS luôn sẵn sàng hỗ trợ sửa CV và Mock Interview.*
`;
}
