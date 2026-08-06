import React, { useState } from 'react';
import { UploadCloud, Download, FileSpreadsheet, CheckCircle2, FileText } from 'lucide-react';
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

    // Create 2 simulated imported job items
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
        description: 'Tham gia dự án phần mềm kế toán doanh nghiệp SaaS MISA meInvoice.',
        requirements: 'Học viên các khóa Web MindX, nắm vững HTML/CSS/JS/ReactJS.',
        skills: ['ReactJS', 'C#', '.NET Core', 'SQL Server'],
        salary: '3.000.000 - 4.500.000 VNĐ',
        benefits: 'Thưởng hiệu quả công việc, hỗ trợ cơm trưa, đào tạo chuyên sâu.',
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Import & Export Dữ Liệu Excel / CSV</h3>
          <p className="text-xs text-slate-400">Nhập danh sách job từ file Excel bên ngoài hoặc xuất dữ liệu cho Team SS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleSimulatedDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
            isDragOver
              ? 'border-rose-500 bg-rose-500/10'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6 text-rose-400" />
          </div>
          <h4 className="font-bold text-white text-sm">Kéo & Thả File Excel/CSV Vào Đây</h4>
          <p className="text-xs text-slate-400 mt-1">Hỗ trợ các định dạng .xlsx, .csv (Tối đa 10MB)</p>

          {uploadSuccess && (
            <div className="mt-3 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã import thành công 1 Job mẫu vào DB!</span>
            </div>
          )}
        </div>

        {/* Export Action Card */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-bold text-white text-sm flex items-center space-x-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Xuất Dữ Liệu Cho Team SS & Google Sheets</span>
            </h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Xuất toàn bộ <strong>{jobs.length} jobs</strong> đang có trong cơ sở dữ liệu thành file CSV chuẩn UTF-8 (Tương thích tốt với Microsoft Excel và Google Sheets).
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => exportJobsToCSV(jobs)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-900/30"
            >
              <Download className="w-4 h-4" />
              <span>Tải Xuất File Excel / CSV ({jobs.length} Job)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
