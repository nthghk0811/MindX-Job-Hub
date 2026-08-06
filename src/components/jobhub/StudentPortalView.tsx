import React from 'react';
import { ExternalLink, MapPin, Building2, CheckCircle } from 'lucide-react';
import { JobItem } from '../../types/job';

interface StudentPortalViewProps {
  jobs: JobItem[];
  onSelectJob: (job: JobItem) => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({ jobs, onSelectJob }) => {
  return (
    <div className="space-y-5">

      {/* Portal Banner */}
      <div className="card p-5 bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-indigo-900">Cổng Việc Làm & Thực Tập Học Viên MindX</h2>
          <p className="text-sm text-indigo-600 mt-0.5 max-w-xl">
            Tất cả vị trí bên dưới đã được Team Student Success xác minh. Bạn có thể ứng tuyển trực tiếp qua link gốc hoặc nhờ Mentor giới thiệu.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl whitespace-nowrap">
          <CheckCircle className="w-4 h-4" />
          100% đã kiểm duyệt
        </div>
      </div>

      {/* Job cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map(job => (
          <article key={job.id} className="card-hover flex flex-col">

            <div className="p-4 flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                {job.companyLogo
                  ? <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                  : <Building2 className="w-5 h-5 text-slate-400" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  className="text-sm font-bold text-slate-800 hover:text-indigo-700 cursor-pointer transition-colors line-clamp-2 leading-snug"
                  onClick={() => onSelectJob(job)}
                >
                  {job.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{job.companyName}</p>
              </div>
              <span className="badge-blue shrink-0">{job.level}</span>
            </div>

            <div className="px-4 pb-4 space-y-3">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </span>
                <span className="font-semibold text-amber-700">{job.salary}</span>
                <span>Hạn: {job.deadline}</span>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2">{job.description}</p>

              <div className="flex flex-wrap gap-1">
                {job.skills.map(skill => (
                  <span key={skill} className="skill-pill pointer-events-none">{skill}</span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSelectJob(job)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                >
                  Xem JD đầy đủ & quyền lợi →
                </button>
                <a
                  href={job.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  Ứng tuyển
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </article>
        ))}
      </div>
    </div>
  );
};
