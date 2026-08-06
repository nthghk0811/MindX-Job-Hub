import React from 'react';
import { ExternalLink, Building2, MapPin, DollarSign, Calendar, Sparkles, CheckCircle } from 'lucide-react';
import { JobItem } from '../../types/job';

interface StudentPortalViewProps {
  jobs: JobItem[];
  onSelectJob: (job: JobItem) => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({ jobs, onSelectJob }) => {
  return (
    <div className="space-y-6">
      
      {/* Banner Student Portal */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-red-950 border border-rose-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs mb-1 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>MindX Student Career Portal (NEU Jobs Style)</span>
          </div>
          <h2 className="text-xl font-bold text-white">Cổng Thông Tin Việc Làm & Thực Tập Cho Học Viên MindX</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Các cơ hội việc làm đã qua kiểm duyệt kỹ lưỡng bởi Team Student Success. Học viên có thể ứng tuyển trực tiếp qua Link gốc hoặc gửi CV cho Mentor hỗ trợ giới thiệu.
          </p>
        </div>
        <div className="shrink-0 flex items-center space-x-2 bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800 text-xs">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="font-bold text-white">100% Khảo sát uy tín</div>
            <div className="text-[11px] text-slate-400">Được SS Team xác minh</div>
          </div>
        </div>
      </div>

      {/* Grid of Student-Friendly Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:shadow-rose-950/20">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-700">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base hover:text-rose-400 cursor-pointer line-clamp-1" onClick={() => onSelectJob(job)}>
                      {job.title}
                    </h4>
                    <p className="text-xs text-slate-400">{job.companyName}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {job.level}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-slate-300 mb-3">
                <span className="flex items-center bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-rose-400" />
                  {job.location}
                </span>
                <span className="flex items-center bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-400 font-semibold">
                  <DollarSign className="w-3.5 h-3.5 mr-0.5" />
                  {job.salary}
                </span>
                <span className="flex items-center bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  Hạn: {job.deadline}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {job.skills.map(skill => (
                  <span key={skill} className="px-2 py-0.5 text-[10px] bg-slate-950 text-slate-300 border border-slate-800 rounded">
                    #{skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => onSelectJob(job)}
                className="text-xs text-slate-300 hover:text-white underline font-medium"
              >
                Xem chi tiết JD & Quyền lợi →
              </button>

              <a
                href={job.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md shadow-rose-900/30 transition-colors"
              >
                <span>Ứng tuyển ngay</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
