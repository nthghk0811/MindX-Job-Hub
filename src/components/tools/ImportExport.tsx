import React, { useState } from 'react';
import { UploadCloud, Download, CheckCircle } from 'lucide-react';
import { JobItem } from '../../types/job';
import { exportJobsToCSV } from '../../utils/exportUtils';

interface ImportExportProps {
  jobs: JobItem[];
  onImportJobs: (imported: JobItem[]) => void;
}

export const ImportExport: React.FC<ImportExportProps> = ({ jobs, onImportJobs }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSimulatedDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const sampleImported: JobItem[] = [
      {
        id: `job-imported-${Date.now()}-1`,
        companyName: 'Công ty Cổ phần MISA',
        website: 'https://misa.vn/careers',
        title: 'Thực tập sinh Fullstack Web (React & .NET Core)',
        industry: 'Code',
        level: 'Intern',
        location: 'Hà Nội',
        employmentType: 'Internship',
        description: 'Tham gia dự án phần mềm kế toán SaaS MISA meInvoice.',
        requirements: 'Học viên Web MindX, nắm vững ReactJS.',
        skills: ['ReactJS', 'C#', '.NET Core', 'SQL Server'],
        salary: '3.000.000 - 4.500.000 VNĐ',
        benefits: 'Thưởng hiệu quả, hỗ trợ cơm trưa, đào tạo chuyên sâu.',
        deadline: '2026-09-15',
        originalUrl: 'https://misa.vn/tuyen-dung/intern-fullstack-88',
        source: 'TopCV',
        scrapedAt: new Date().toISOString().split('T')[0],
        status: 'Còn tuyển',
        mindxFitScore: 'High',
        ssNotes: 'Import từ file Excel danh sách đối tác MISA.'
      }
    ];

    onImportJobs(sampleImported);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div className="card p-6 space-y-5">

      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900">Import & Export Dữ liệu</h2>
        <p className="text-xs text-slate-500 mt-0.5">Nhập danh sách job từ file Excel hoặc xuất dữ liệu cho Team SS & Google Sheets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Import drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleSimulatedDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
            isDragOver
              ? 'border-indigo-400 bg-indigo-50'
              : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDragOver ? 'bg-indigo-100' : 'bg-slate-100'}`}>
            <UploadCloud className={`w-6 h-6 ${isDragOver ? 'text-indigo-600' : 'text-slate-400'}`} />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">Kéo & Thả File Excel / CSV</p>
            <p className="text-xs text-slate-400 mt-0.5">Hỗ trợ .xlsx, .csv · Tối đa 10MB</p>
          </div>
          {uploadSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <CheckCircle className="w-4 h-4" />
              Import thành công 1 Job mẫu!
            </div>
          )}
        </div>

        {/* Export card */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Xuất dữ liệu cho Team SS</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Xuất toàn bộ <strong>{jobs.length} jobs</strong> thành file CSV chuẩn UTF-8 – tương thích với Microsoft Excel và Google Sheets.
            </p>
          </div>
          <button
            type="button"
            onClick={() => exportJobsToCSV(jobs)}
            className="btn-primary w-full justify-center"
          >
            <Download className="w-4 h-4" />
            Tải xuống CSV ({jobs.length} Job)
          </button>
        </div>

      </div>
    </div>
  );
};
