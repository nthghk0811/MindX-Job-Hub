import React from 'react';
import { ExternalLink, MapPin, DollarSign, Calendar, Sparkles, Building2, Eye, UserCheck } from 'lucide-react';
import { JobItem } from '../../types/job';

interface JobCardProps {
  job: JobItem;
  onSelectJob: (job: JobItem) => void;
  onMatchStudent: (job: JobItem) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelectJob, onMatchStudent }) => {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Còn tuyển':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Đã gửi học viên':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Chưa xác minh':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  const getFitBadge = (fit: string) => {
    switch (fit) {
      case 'High':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  return (
    <div className="group bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between">
      
      {/* Header Card */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-1">
                {job.level} • {job.industry}
              </span>
              <p className="text-xs text-slate-400 truncate max-w-[170px]" title={job.companyName}>
                {job.companyName}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getFitBadge(job.mindxFitScore)}`}>
              Fit: {job.mindxFitScore}
            </span>
            <span className="text-[10px] text-slate-500 flex items-center">
              <Calendar className="w-3 h-3 mr-0.5" />
              {job.scrapedAt}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelectJob(job)}
          className="text-base font-bold text-white group-hover:text-rose-400 transition-colors cursor-pointer line-clamp-2 mb-2"
        >
          {job.title}
        </h3>

        {/* Short details */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
          <span className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            {job.location}
          </span>
          <span className="flex items-center">
            <DollarSign className="w-3.5 h-3.5 mr-0.5 text-amber-400" />
            {job.salary}
          </span>
          <a
            href={job.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center text-sky-400 hover:underline ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mr-1">{job.source}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Required Skills badges */}
        <div className="flex flex-wrap gap-1 mb-4">
          {job.skills.slice(0, 4).map(skill => (
            <span key={skill} className="px-2 py-0.5 text-[10px] font-medium bg-slate-950 text-slate-300 border border-slate-800 rounded">
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="px-1.5 py-0.5 text-[10px] text-slate-500 bg-slate-950 border border-slate-800 rounded">
              +{job.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer Card */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${getStatusBadge(job.status)}`}>
          {job.status}
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMatchStudent(job)}
            title="Gợi ý học viên phù hợp"
            className="p-2 text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30 rounded-xl transition-all"
          >
            <UserCheck className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onSelectJob(job)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white rounded-xl transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Chi tiết</span>
          </button>
        </div>
      </div>

    </div>
  );
};
