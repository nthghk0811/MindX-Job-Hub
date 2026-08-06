import React from 'react';
import { ExternalLink, MapPin, Building2, UserCheck, Eye } from 'lucide-react';
import { JobItem } from '../../types/job';

interface JobCardProps {
  job: JobItem;
  onSelectJob: (job: JobItem) => void;
  onMatchStudent: (job: JobItem) => void;
}

const LEVEL_BADGE: Record<string, string> = {
  Intern:  'badge-blue',
  Fresher: 'badge-violet',
  Junior:  'badge-green',
};

const STATUS_BADGE: Record<string, string> = {
  'Còn tuyển':       'badge-green',
  'Đã gửi học viên': 'badge-blue',
  'Chưa xác minh':  'badge-amber',
  'Hết hạn':         'badge-rose',
};

const FIT_BADGE: Record<string, string> = {
  High:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 border border-amber-200',
  Low:    'bg-rose-50 text-rose-700 border border-rose-200',
};

export const JobCard: React.FC<JobCardProps> = ({ job, onSelectJob, onMatchStudent }) => {
  return (
    <article className="card-hover flex flex-col">

      {/* Header */}
      <div className="p-4 flex items-start gap-3 border-b border-slate-100">
        {/* Company logo placeholder */}
        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
          {job.companyLogo ? (
            <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-5 h-5 text-slate-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className={LEVEL_BADGE[job.level] || 'badge-slate'}>{job.level}</span>
            <span className="badge-slate">{job.industry}</span>
          </div>
          <p className="text-xs text-slate-500 truncate">{job.companyName}</p>
        </div>

        {/* Fit score + scraped date */}
        <div className="flex flex-col items-end gap-1 shrink-0 text-right">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${FIT_BADGE[job.mindxFitScore]}`}>
            Fit {job.mindxFitScore}
          </span>
          <span className="text-[10px] text-slate-400">{job.scrapedAt}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 space-y-2">
        <h3
          onClick={() => onSelectJob(job)}
          className="text-sm font-bold text-slate-800 hover:text-indigo-700 cursor-pointer leading-snug line-clamp-2 transition-colors"
        >
          {job.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {job.location}
          </span>
          <span className="font-semibold text-slate-700">{job.salary}</span>
          <a
            href={job.originalUrl}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className="ml-auto flex items-center gap-0.5 text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {job.source}
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        {/* Skill badges – top 4 only */}
        <div className="flex flex-wrap gap-1">
          {job.skills.slice(0, 4).map(skill => (
            <span key={skill} className="skill-pill pointer-events-none">{skill}</span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-[10px] text-slate-400 self-center">+{job.skills.length - 4}</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex items-center justify-between">
        <span className={STATUS_BADGE[job.status] || 'badge-slate'}>{job.status}</span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onMatchStudent(job)}
            title="Gợi ý học viên phù hợp"
            className="btn-ghost p-1.5 text-slate-500 hover:text-indigo-600"
          >
            <UserCheck className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onSelectJob(job)}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            Xem chi tiết
          </button>
        </div>
      </div>

    </article>
  );
};
