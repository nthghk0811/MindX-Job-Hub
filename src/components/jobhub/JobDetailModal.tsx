import React, { useState } from 'react';
import { X, ExternalLink, Save, UserCheck, Trash2, CheckCircle } from 'lucide-react';
import { JobItem, JobStatusType } from '../../types/job';

interface JobDetailModalProps {
  job: JobItem | null;
  onClose: () => void;
  onUpdateSsNotes: (jobId: string, notes: string) => void;
  onUpdateStatus: (jobId: string, status: JobStatusType) => void;
  onMatchStudent: (job: JobItem) => void;
  onDeleteJob: (jobId: string) => void;
}

const FIELD_LABEL = 'block text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5';

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
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    setNotes(job.ssNotes || '');
  }, [job]);

  const handleSave = () => {
    onUpdateSsNotes(job.id, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl space-y-0">

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-4 rounded-t-2xl">
          <div className="flex items-center gap-3 min-w-0">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="badge-blue">{job.industry}</span>
                <span className="badge-slate">{job.level}</span>
                <span className="badge-slate">{job.employmentType}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">{job.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">{job.companyName}</span>
                <span>·</span>
                <a href={job.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-0.5">
                  Website <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost p-2 text-slate-400 hover:text-slate-700 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Key metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm">
            <div>
              <p className={FIELD_LABEL}>Mức lương</p>
              <p className="font-bold text-amber-700">{job.salary}</p>
            </div>
            <div>
              <p className={FIELD_LABEL}>Địa điểm</p>
              <p className="font-semibold text-slate-800">{job.location}</p>
            </div>
            <div>
              <p className={FIELD_LABEL}>Hạn nộp</p>
              <p className="font-semibold text-slate-800">{job.deadline}</p>
            </div>
            <div>
              <p className={FIELD_LABEL}>Fit MindX</p>
              <p className={`font-bold ${
                job.mindxFitScore === 'High'   ? 'text-emerald-700' :
                job.mindxFitScore === 'Medium' ? 'text-amber-700'   : 'text-rose-700'
              }`}>
                {job.mindxFitScore === 'High' ? 'High (Khớp cao)' : job.mindxFitScore === 'Medium' ? 'Medium (Khớp TB)' : 'Low (Khớp thấp)'}
              </p>
            </div>
            <div>
              <p className={FIELD_LABEL}>Nguồn</p>
              <p className="text-indigo-700 font-semibold">{job.source}</p>
            </div>
            <div>
              <p className={FIELD_LABEL}>Ngày cào</p>
              <p className="text-slate-700">{job.scrapedAt}</p>
            </div>
            <div>
              <p className={FIELD_LABEL}>Trạng thái</p>
              <select
                value={job.status}
                onChange={e => onUpdateStatus(job.id, e.target.value as JobStatusType)}
                className="input text-xs py-1"
              >
                <option value="Còn tuyển">Còn tuyển</option>
                <option value="Hết hạn">Hết hạn</option>
                <option value="Chưa xác minh">Chưa xác minh</option>
                <option value="Đã gửi học viên">Đã gửi học viên</option>
              </select>
            </div>
            <div>
              <p className={FIELD_LABEL}>Link gốc</p>
              <a href={job.originalUrl} target="_blank" rel="noreferrer"
                className="text-indigo-600 hover:underline text-xs flex items-center gap-0.5 font-semibold mt-1">
                Mở JD <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className={FIELD_LABEL}>Kỹ năng / Công nghệ yêu cầu</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {job.skills.map(s => <span key={s} className="skill-pill pointer-events-none">{s}</span>)}
            </div>
          </div>

          {/* JD + Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className={FIELD_LABEL + ' text-indigo-700'}>Mô tả công việc</p>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed mt-1">{job.description}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className={FIELD_LABEL + ' text-emerald-700'}>Yêu cầu ứng viên</p>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed mt-1">{job.requirements}</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className={FIELD_LABEL + ' text-amber-700'}>Quyền lợi & Đãi ngộ</p>
            <p className="text-sm text-slate-700 mt-1">{job.benefits}</p>
          </div>

          {/* SS Notes */}
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <p className={FIELD_LABEL + ' text-indigo-700'}>Ghi chú nội bộ Team SS</p>
              {saved && (
                <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Đã lưu
                </span>
              )}
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ghi chú về HR, học viên đã apply, kết quả phỏng vấn..."
              className="input text-sm resize-none bg-white"
            />
            <div className="flex justify-end">
              <button type="button" onClick={handleSave} className="btn-primary text-xs">
                <Save className="w-3.5 h-3.5" />
                Lưu ghi chú
              </button>
            </div>
          </div>

          {/* Actions row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { onDeleteJob(job.id); onClose(); }}
              className="btn-ghost text-rose-600 hover:bg-rose-50 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Xóa job này
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { onClose(); onMatchStudent(job); }}
                className="btn-secondary"
              >
                <UserCheck className="w-4 h-4" />
                Gợi ý học viên phù hợp
              </button>
              <a
                href={job.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Mở link JD gốc
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
