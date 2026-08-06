import React, { useState } from 'react';
import { Trash2, GitMerge, ShieldCheck } from 'lucide-react';
import { DedupPair, JobItem } from '../../types/job';

interface DeduplicationToolProps {
  jobs: JobItem[];
  onMergeJobs: (pairId: string, keepJob: JobItem) => void;
  onDeleteDuplicate: (pairId: string, removeJobId: string) => void;
}

export const DeduplicationTool: React.FC<DeduplicationToolProps> = ({
  jobs,
  onMergeJobs,
  onDeleteDuplicate
}) => {
  const [pairs, setPairs] = useState<DedupPair[]>([
    {
      id: 'pair-1',
      jobA: jobs[0] || {} as JobItem,
      jobB: { ...jobs[0], id: 'job-101-dup', source: 'LinkedIn', scrapedAt: '2026-08-06', ssNotes: 'Crawl trùng từ LinkedIn.' } as JobItem,
      similarityReason: 'Trùng 100% Tên công ty (Cốc Cốc) & Vị trí (Intern Node.js)',
      confidence: 96
    },
    {
      id: 'pair-2',
      jobA: jobs[1] || {} as JobItem,
      jobB: { ...jobs[1], id: 'job-102-dup', source: 'VietnamWorks', scrapedAt: '2026-08-06', ssNotes: 'Crawl trùng từ VietnamWorks.' } as JobItem,
      similarityReason: 'Trùng URL JD gốc & Yêu cầu (HDBank Data Analyst)',
      confidence: 92
    }
  ]);

  const handleMerge = (pairId: string, keepJob: JobItem) => {
    onMergeJobs(pairId, keepJob);
    setPairs(prev => prev.filter(p => p.id !== pairId));
  };

  const handleDelete = (pairId: string, removeJobId: string) => {
    onDeleteDuplicate(pairId, removeJobId);
    setPairs(prev => prev.filter(p => p.id !== pairId));
  };

  return (
    <div className="card p-6 space-y-5">

      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Phát hiện & Loại bỏ Job Trùng lặp</h2>
          <p className="text-xs text-slate-500 mt-0.5">Quét tự động theo URL gốc và Tên công ty + Vị trí tuyển dụng.</p>
        </div>
        {pairs.length > 0 && (
          <span className="badge-amber">{pairs.length} cặp nghi trùng</span>
        )}
      </div>

      {pairs.length === 0 ? (
        <div className="p-10 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-100">
          <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
          <p className="font-bold text-slate-800">Database hoàn toàn sạch!</p>
          <p className="text-xs text-slate-500">Không tìm thấy bản ghi trùng lặp nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pairs.map(pair => (
            <div key={pair.id} className="border border-amber-200 bg-amber-50/50 rounded-2xl p-5 space-y-4">

              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-700">
                  <span className="font-bold text-amber-700">Nghi trùng:</span> {pair.similarityReason}
                </p>
                <span className="badge-rose font-bold">Tin cậy {pair.confidence}%</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'Bản ghi A (TopCV)', job: pair.jobA, color: 'text-emerald-700' },
                  { label: `Bản ghi B (${pair.jobB.source})`, job: pair.jobB, color: 'text-sky-700' }
                ].map(({ label, job, color }) => (
                  <div key={label} className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                    <p className={`font-bold ${color}`}>{label}</p>
                    <p className="font-bold text-slate-800 text-sm">{job.title}</p>
                    <p className="text-slate-500">{job.companyName} · {job.location}</p>
                    <p className="font-semibold text-amber-700">{job.salary}</p>
                    <p className="text-slate-400 text-[10px]">{job.scrapedAt}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => handleDelete(pair.id, pair.jobB.id)}
                  className="btn-ghost text-rose-600 hover:bg-rose-50 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa Bản ghi B (Bản trùng)
                </button>
                <button
                  type="button"
                  onClick={() => handleMerge(pair.id, pair.jobA)}
                  className="btn-primary text-xs"
                >
                  <GitMerge className="w-3.5 h-3.5" />
                  Gộp dữ liệu A + B
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
