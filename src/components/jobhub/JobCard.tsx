import React from 'react';
import { ExternalLink, MapPin, Calendar, Users } from 'lucide-react';
import { JobItem } from '../../types/job';

interface JobCardProps {
  job: JobItem;
  onSelectJob: (job: JobItem) => void;
  onMatchStudent: (job: JobItem) => void;
}

const INDUSTRY_STYLE: Record<string, string> = {
  'Code':              'badge-violet',
  'Data Analysis':     'badge-amber',
  'Business Analysis': 'badge-blue',
};

const LEVEL_STYLE: Record<string, string> = {
  'Intern':  'badge-blue',
  'Fresher': 'badge-green',
  'Junior':  'badge-slate',
};

const STATUS_STYLE: Record<string, string> = {
  'Còn tuyển':       'badge-green',
  'Hết hạn':         'badge-rose',
  'Chưa xác minh':   'badge-amber',
  'Đã gửi học viên': 'badge-blue',
};

const FIT_STYLE: Record<string, string> = {
  High:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50  text-amber-700  border-amber-200',
  Low:    'bg-rose-50   text-rose-700   border-rose-200',
};

function CompanyInitials({ name }: { name: string }) {
  const words = name.split(' ').filter(Boolean);
  const initials = words.length >= 2 ? words[0][0] + words[1][0] : name.slice(0, 2);
  return <span className="text-xs font-bold uppercase">{initials}</span>;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelectJob, onMatchStudent }) => {
  const shownSkills = job.skills.slice(0, 4);
  const extraSkills = job.skills.length - 4;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-200 transition-all duration-200 flex flex-col overflow-hidden">

      {/* Card header */}
      <div className="p-4 pb-0 flex items-start gap-3">
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden text-slate-500">
          {job.companyLogo
            ? <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
            : <CompanyInitials name={job.companyName} />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`badge text-[10px] ${LEVEL_STYLE[job.level] || 'badge-slate'}`}>{job.level}</span>
            <span className={`badge text-[10px] ${INDUSTRY_STYLE[job.industry] || 'badge-slate'}`}>{job.industry}</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">{job.companyName}</p>
        </div>

        {/* Source badge */}
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md shrink-0">
          {job.source}
        </span>
      </div>

      {/* Job title */}
      <div className="px-4 pt-2.5 pb-0">
        <h3
          onClick={() => onSelectJob(job)}
          className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 cursor-pointer hover:text-indigo-700 transition-colors"
        >
          {job.title}
        </h3>
      </div>

      {/* Meta row */}
      <div className="px-4 pt-2 flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" />
          {job.location}
        </span>
        <span className="font-semibold text-amber-700">{job.salary}</span>
        <span className="flex items-center gap-1 ml-auto text-slate-400">
          <Calendar className="w-3 h-3 shrink-0" />
          {job.deadline}
        </span>
      </div>

      {/* Skills */}
      <div className="px-4 pt-2.5 flex flex-wrap gap-1">
        {shownSkills.map(s => (
          <span key={s} className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-100 rounded-md">
            {s}
          </span>
        ))}
        {extraSkills > 0 && (
          <span className="text-[10px] text-slate-400 self-center">+{extraSkills}</span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 px-4 pb-3 flex items-center justify-between border-t border-slate-50">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectJob(job)}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Xem chi tiết
          </button>
          <span className="text-slate-200">·</span>
          <button
            type="button"
            onClick={() => onMatchStudent(job)}
            className="flex items-center gap-0.5 text-[11px] font-medium text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <Users className="w-3 h-3" />
            Match HV
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${FIT_STYLE[job.mindxFitScore] || ''}`}>
            {job.mindxFitScore}
          </span>
          <span className={`badge text-[10px] ${STATUS_STYLE[job.status] || 'badge-slate'}`}>
            {job.status === 'Còn tuyển' ? 'Còn tuyển' :
             job.status === 'Đã gửi học viên' ? 'Đã gửi' :
             job.status === 'Chưa xác minh' ? 'Chưa xác minh' : 'Hết hạn'}
          </span>
          {job.originalUrl && (
            <a
              href={job.originalUrl}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-slate-300 hover:text-indigo-500 transition-colors"
              aria-label="Link JD gốc"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
