import React, { useState } from 'react';
import { X, ExternalLink, Building2, MapPin, DollarSign, Calendar, Sparkles, CheckCircle2, UserCheck, Save, Edit3, Trash2 } from 'lucide-react';
import { JobItem, JobStatusType } from '../../types/job';

interface JobDetailModalProps {
  job: JobItem | null;
  onClose: () => void;
  onUpdateSsNotes: (jobId: string, notes: string) => void;
  onUpdateStatus: (jobId: string, status: JobStatusType) => void;
  onMatchStudent: (job: JobItem) => void;
  onDeleteJob: (jobId: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  onUpdateSsNotes,
  onUpdateStatus,
  onMatchStudent,
  onDeleteJob
}) => {
  if (!job) return null;

  const [notes, setNotes] = useState(job.ssNotes || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveNotes = () => {
    onUpdateSsNotes(job.id, notes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 text-slate-200">
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-7 h-7 text-slate-400" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-md">
                  {job.industry} • {job.level}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                  {job.employmentType}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{job.title}</h2>
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                <span className="font-semibold text-slate-300">{job.companyName}</span>
                <span>•</span>
                <a href={job.website} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center">
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 18 Data Fields Highlight Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block uppercase font-semibold text-[10px]">Mức Lương / Trợ Cấp</span>
            <span className="text-amber-400 font-bold text-sm">{job.salary}</span>
          </div>

          <div>
            <span className="text-slate-500 block uppercase font-semibold text-[10px]">Địa Điểm</span>
            <span className="text-slate-200 font-semibold">{job.location}</span>
          </div>

          <div>
            <span className="text-slate-500 block uppercase font-semibold text-[10px]">Hạn Ứng Tuyển</span>
            <span className="text-slate-200 font-semibold">{job.deadline}</span>
          </div>

          <div>
            <span className="text-slate-500 block uppercase font-semibold text-[10px]">MindX Fit Score</span>
            <span className={`font-bold ${
              job.mindxFitScore === 'High' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {job.mindxFitScore} (Khớp 92%)
            </span>
          </div>

          <div>
            <span className="text-slate-500 block uppercase font-semibold text-[10px]">Nguồn Cào Job</span>
            <span className="text-sky-400 font-semibold">{job.source}</span>
          </div>

          <div>
            <span className="text-slate-500 block uppercase font-semibold text-[10px]">Ngày Thu Thập</span>
            <span className="text-slate-300">{job.scrapedAt}</span>
          </div>

          <div>
            <span className="text-slate-500 block uppercase font-semibold text-[10px]">Trạng Thái Hiện Tại</span>
            <select
              value={job.status}
              onChange={(e) => onUpdateStatus(job.id, e.target.value as JobStatusType)}
              className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-0.5 mt-0.5 text-xs font-semibold focus:outline-none focus:border-rose-500"
            >
              <option value="Còn tuyển">Còn tuyển</option>
              <option value="Hết hạn">Hết hạn</option>
              <option value="Chưa xác minh">Chưa xác minh</option>
              <option value="Đã gửi học viên">Đã gửi học viên</option>
            </select>
          </div>

          <div>
            <span className="text-slate-500 block uppercase font-semibold text-[10px]">Link Gốc</span>
            <a href={job.originalUrl} target="_blank" rel="noreferrer" className="text-sky-400 underline font-semibold flex items-center mt-1">
              <span>Mở JD Gốc</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>

        {/* Required Skills Badges */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Kỹ Năng / Công Nghệ Bắt Buộc</h4>
          <div className="flex flex-wrap gap-2">
            {job.skills.map(skill => (
              <span key={skill} className="px-3 py-1 bg-slate-950 text-rose-300 font-semibold border border-slate-800 rounded-lg text-xs">
                #{skill}
              </span>
            ))}
          </div>
        </div>

        {/* Job Description & Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">Mô Tả Công Việc (Job Description)</h4>
            <p className="text-xs leading-relaxed text-slate-300 whitespace-pre-line">{job.description}</p>
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Yêu Cầu Ứng Viên</h4>
            <p className="text-xs leading-relaxed text-slate-300 whitespace-pre-line">{job.requirements}</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Quyền Lợi Đãi Ngộ</h4>
          <p className="text-xs leading-relaxed text-slate-300">{job.benefits}</p>
        </div>

        {/* SS Team Internal Notes (Editable Area) */}
        <div className="space-y-2 bg-rose-950/20 border border-rose-500/30 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Ghi Chú Nội Bộ Team Student Success (SS Notes)</span>
            </div>
            {isSaved && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Đã lưu ghi chú!
              </span>
            )}
          </div>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú về HR, học viên đã apply, phỏng vấn, hoặc phản hồi từ doanh nghiệp..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSaveNotes}
              className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu Ghi Chú SS</span>
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onDeleteJob(job.id);
              onClose();
            }}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa Job Này</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose();
                onMatchStudent(job);
              }}
              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-colors shadow-lg shadow-amber-500/20"
            >
              <UserCheck className="w-4 h-4" />
              <span>Gợi Ý Học Viên Phù Hợp</span>
            </button>

            <a
              href={job.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-colors shadow-lg shadow-rose-900/30"
            >
              <span>Truy Cập Link JD Gốc</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
