import React from 'react';
import { ExternalLink, Eye, UserCheck, Trash2, Edit } from 'lucide-react';
import { JobItem } from '../../types/job';

interface JobTableViewProps {
  jobs: JobItem[];
  onSelectJob: (job: JobItem) => void;
  onMatchStudent: (job: JobItem) => void;
  onDeleteJob: (id: string) => void;
}

export const JobTableView: React.FC<JobTableViewProps> = ({
  jobs,
  onSelectJob,
  onMatchStudent,
  onDeleteJob
}) => {
  return (
    <div className="w-full overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
            <th className="p-3.5">Công ty & Vị trí</th>
            <th className="p-3.5">Ngành & Level</th>
            <th className="p-3.5">Địa điểm</th>
            <th className="p-3.5">Mức Lương</th>
            <th className="p-3.5">Nguồn</th>
            <th className="p-3.5">Trạng thái</th>
            <th className="p-3.5">Fit Score</th>
            <th className="p-3.5 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {jobs.map(job => (
            <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
              <td className="p-3.5">
                <div className="font-bold text-white hover:text-rose-400 cursor-pointer" onClick={() => onSelectJob(job)}>
                  {job.title}
                </div>
                <div className="text-slate-400 text-[11px]">{job.companyName}</div>
              </td>
              <td className="p-3.5">
                <span className="px-2 py-0.5 rounded bg-slate-950 text-rose-400 font-medium border border-slate-800">
                  {job.industry}
                </span>
                <div className="text-[11px] text-slate-400 mt-0.5">{job.level}</div>
              </td>
              <td className="p-3.5">{job.location}</td>
              <td className="p-3.5 text-amber-400 font-medium">{job.salary}</td>
              <td className="p-3.5">
                <a href={job.originalUrl} target="_blank" rel="noreferrer" className="flex items-center text-sky-400 hover:underline">
                  <span>{job.source}</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </td>
              <td className="p-3.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {job.status}
                </span>
              </td>
              <td className="p-3.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  job.mindxFitScore === 'High' ? 'text-emerald-400 bg-emerald-500/20' : 'text-amber-400 bg-amber-500/20'
                }`}>
                  {job.mindxFitScore}
                </span>
              </td>
              <td className="p-3.5 text-right space-x-1">
                <button
                  onClick={() => onMatchStudent(job)}
                  title="Gợi ý học viên"
                  className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg"
                >
                  <UserCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSelectJob(job)}
                  title="Xem chi tiết"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteJob(job.id)}
                  title="Xóa job"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
