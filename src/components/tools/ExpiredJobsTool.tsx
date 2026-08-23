import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, Loader2, CalendarX, ShieldCheck } from 'lucide-react';
import { getExpiredJobs, purgeExpiredJobs } from '../../services/jobService';

interface ExpiredJob {
  _id: string;
  title: string;
  companyName: string;
  deadline: string;
  status: string;
}

interface ExpiredJobsToolProps {
  onJobsDeleted?: () => void;
}

export const ExpiredJobsTool: React.FC<ExpiredJobsToolProps> = ({ onJobsDeleted }) => {
  const [jobs, setJobs] = useState<ExpiredJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchExpired = async () => {
    setIsLoading(true);
    try {
      const data = await getExpiredJobs();
      setJobs(data);
      setHasScanned(true);
    } catch {
      showToast('Lỗi khi tải danh sách job hết hạn');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchExpired(); }, []);

  const handlePurge = async () => {
    if (!confirm(`Xác nhận xóa ${jobs.length} job hết hạn? Các job có trạng thái "Đã gửi học viên" sẽ được giữ lại.`)) return;
    setIsDeleting(true);
    try {
      const result = await purgeExpiredJobs();
      showToast(result.message);
      setJobs([]);
      onJobsDeleted?.();
    } catch {
      showToast('Lỗi khi xóa job hết hạn');
    } finally {
      setIsDeleting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const daysOverdue = (deadline: string) => {
    const diff = Math.floor((new Date(today).getTime() - new Date(deadline).getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CalendarX className="w-4 h-4 text-rose-500" />
            Dọn dẹp Job Hết hạn
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quét và xóa các job đã qua deadline. Job "Đã gửi học viên" sẽ được giữ lại.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchExpired} disabled={isLoading} className="btn-secondary text-xs py-1.5 px-3 gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            {isLoading ? 'Đang quét...' : 'Quét lại'}
          </button>
          {jobs.length > 0 && (
            <button onClick={handlePurge} disabled={isDeleting} className="btn-ghost text-rose-600 hover:bg-rose-50 text-xs py-1.5 px-3 gap-1.5 border border-rose-200">
              <Trash2 className="w-3.5 h-3.5" />
              {isDeleting ? 'Đang xóa...' : `Xóa tất cả (${jobs.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-10 flex flex-col items-center gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <p className="text-xs">Đang quét cơ sở dữ liệu...</p>
        </div>
      ) : hasScanned && jobs.length === 0 ? (
        <div className="p-10 text-center space-y-2 bg-emerald-50/60 rounded-2xl border border-emerald-100">
          <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
          <p className="font-bold text-slate-800 text-sm">Không có job hết hạn!</p>
          <p className="text-xs text-slate-500">Toàn bộ job trong DB đều còn trong hạn hoặc đã được xử lý.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {jobs.map(job => (
            <div key={job._id} className="flex items-center justify-between bg-rose-50/50 border border-rose-100 rounded-xl px-4 py-2.5 text-xs">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 truncate">{job.title}</p>
                <p className="text-slate-500">{job.companyName}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-rose-600 font-semibold">Hết hạn: {job.deadline}</p>
                <p className="text-slate-400">{daysOverdue(job.deadline)} ngày trước</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
};
