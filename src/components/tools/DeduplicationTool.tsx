import React, { useState, useEffect } from 'react';
import { Trash2, GitMerge, ShieldCheck, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import { JobItem } from '../../types/job';
import { getDuplicates, deleteJob } from '../../services/jobService';

interface DuplicatePair {
  jobA: JobItem;
  jobB: JobItem;
  reason: string;
  confidence: number;
}

interface DeduplicationToolProps {
  jobs: JobItem[];
  onMergeJobs: (pairId: string, keepJob: JobItem) => void;
  onDeleteDuplicate: (pairId: string, removeJobId: string) => void;
}

export const DeduplicationTool: React.FC<DeduplicationToolProps> = ({
  onMergeJobs,
  onDeleteDuplicate,
}) => {
  const [pairs, setPairs] = useState<DuplicatePair[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDuplicates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDuplicates();
      // Map MongoDB _id to id if needed
      const mapped = (data || []).map((p: any) => ({
        ...p,
        jobA: { ...p.jobA, id: p.jobA._id || p.jobA.id },
        jobB: { ...p.jobB, id: p.jobB._id || p.jobB.id },
      }));
      setPairs(mapped);
      setHasScanned(true);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi quét trùng lặp');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDuplicates();
  }, []);

  const handleDelete = async (index: number, removeJobId: string) => {
    try {
      await deleteJob(removeJobId);
      onDeleteDuplicate(`pair-${index}`, removeJobId);
      setPairs((prev) => prev.filter((_, i) => i !== index));
    } catch {
      // Fallback local remove
      onDeleteDuplicate(`pair-${index}`, removeJobId);
      setPairs((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleMerge = (index: number, keepJob: JobItem) => {
    onMergeJobs(`pair-${index}`, keepJob);
    setPairs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Phát hiện & Loại bỏ Job Trùng lặp</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quét trực tiếp toàn bộ Database theo URL gốc và Tên công ty + Tiêu đề bài đăng.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchDuplicates}
            disabled={isLoading}
            className="btn-secondary text-xs py-1.5 px-3 gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{isLoading ? 'Đang quét...' : 'Quét lại DB'}</span>
          </button>
          {pairs.length > 0 && <span className="badge-amber">{pairs.length} cặp nghi trùng</span>}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center gap-2 text-slate-500">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs font-semibold">Đang phân tích độ tương đồng trong cơ sở dữ liệu...</p>
        </div>
      ) : hasScanned && pairs.length === 0 ? (
        <div className="p-10 text-center space-y-2 bg-emerald-50/60 rounded-2xl border border-emerald-100">
          <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
          <p className="font-bold text-slate-800 text-sm">Database hoàn toàn sạch!</p>
          <p className="text-xs text-slate-500">
            Không tìm thấy bản ghi nào bị trùng lặp URL hoặc trùng tiêu đề trong cơ sở dữ liệu.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pairs.map((pair, idx) => (
            <div key={idx} className="border border-amber-200 bg-amber-50/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-700">
                  <span className="font-bold text-amber-700">Lý do nghi trùng:</span> {pair.reason}
                </p>
                <span className="badge-rose font-bold text-[11px]">Độ tin cậy {pair.confidence}%</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: `Bản ghi A (${pair.jobA.source || 'Nguồn gốc'})`, job: pair.jobA, color: 'text-emerald-700' },
                  { label: `Bản ghi B (${pair.jobB.source || 'Nguồn trùng'})`, job: pair.jobB, color: 'text-sky-700' },
                ].map(({ label, job, color }) => (
                  <div key={label} className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                    <p className={`font-bold ${color}`}>{label}</p>
                    <p className="font-bold text-slate-800 text-sm">{job.title}</p>
                    <p className="text-slate-500">
                      {job.companyName} · {job.location}
                    </p>
                    <p className="font-semibold text-amber-700">{job.salary}</p>
                    <p className="text-slate-400 text-[10px]">Thu thập: {job.scrapedAt}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => handleDelete(idx, pair.jobB.id)}
                  className="btn-ghost text-rose-600 hover:bg-rose-50 text-xs gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa Bản ghi B (Bản trùng)
                </button>
                <button
                  type="button"
                  onClick={() => handleMerge(idx, pair.jobA)}
                  className="btn-primary text-xs gap-1.5"
                >
                  <GitMerge className="w-3.5 h-3.5" />
                  Gộp dữ liệu
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
