import React from 'react';
import { ExternalLink, UserCheck, Trash2, Eye } from 'lucide-react';
import { JobItem } from '../../types/job';

interface JobTableViewProps {
  jobs: JobItem[];
  onSelectJob: (job: JobItem) => void;
  onMatchStudent: (job: JobItem) => void;
  onDeleteJob: (id: string) => void;
}

const FIT_CLASS: Record<string, string> = {
  High:   'text-emerald-700 font-bold',
  Medium: 'text-amber-700 font-bold',
  Low:    'text-rose-700 font-bold',
};

const STATUS_CLASS: Record<string, string> = {
  'Còn tuyển':       'badge-green',
  'Đã gửi học viên': 'badge-blue',
  'Chưa xác minh':  'badge-amber',
  'Hết hạn':         'badge-rose',
};

export const JobTableView: React.FC<JobTableViewProps> = ({
  jobs,
  onSelectJob,
  onMatchStudent,
  onDeleteJob
}) => {
  return (
    <div className="w-full overflow-x-auto card">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {['Vị trí & Công ty', 'Ngành · Level', 'Địa điểm', 'Lương', 'Nguồn', 'Trạng thái', 'Fit', ''].map(h => (
              <th key={h} className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {jobs.map(job => (
            <tr key={job.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onSelectJob(job)}
                  className="text-left font-semibold text-slate-800 hover:text-indigo-700 transition-colors text-sm"
                >
                  {job.title}
                </button>
                <div className="text-xs text-slate-400 mt-0.5">{job.companyName}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-xs font-medium text-indigo-700">{job.industry}</span>
                <div className="text-xs text-slate-400">{job.level}</div>
              </td>
              <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{job.location}</td>
              <td className="px-4 py-3 text-xs font-semibold text-slate-700 whitespace-nowrap">{job.salary}</td>
              <td className="px-4 py-3">
                <a
                  href={job.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-0.5 text-xs text-indigo-600 hover:underline"
                >
                  {job.source}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={STATUS_CLASS[job.status] || 'badge-slate'}>{job.status}</span>
              </td>
              <td className={`px-4 py-3 text-xs whitespace-nowrap ${FIT_CLASS[job.mindxFitScore] || ''}`}>
                {job.mindxFitScore}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => onMatchStudent(job)} title="Gợi ý học viên" className="btn-ghost p-1 text-slate-400 hover:text-indigo-600">
                    <UserCheck className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => onSelectJob(job)} title="Xem chi tiết" className="btn-ghost p-1 text-slate-400 hover:text-slate-800">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => onDeleteJob(job.id)} title="Xóa" className="btn-ghost p-1 text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
