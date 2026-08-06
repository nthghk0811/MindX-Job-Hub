import React, { useState } from 'react';
import { Copy, GitMerge, Trash2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
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

  // Create sample duplicate pairs from current jobs
  const [pairs, setPairs] = useState<DedupPair[]>([
    {
      id: 'pair-1',
      jobA: jobs[0] || {} as JobItem,
      jobB: {
        ...jobs[0],
        id: 'job-101-dup',
        source: 'LinkedIn',
        scrapedAt: '2026-08-06',
        ssNotes: 'Crawl trùng từ LinkedIn đăng lại tin TopCV.'
      } as JobItem,
      similarityReason: 'Trùng khớp 100% Tên công ty (Cốc Cốc) & Vị trí tuyển dụng (Intern Node.js)',
      confidence: 96
    },
    {
      id: 'pair-2',
      jobA: jobs[1] || {} as JobItem,
      jobB: {
        ...jobs[1],
        id: 'job-102-dup',
        source: 'VietnamWorks',
        scrapedAt: '2026-08-06',
        ssNotes: 'Crawl trùng từ VietnamWorks.'
      } as JobItem,
      similarityReason: 'Trùng khớp URL JD gốc & Yêu cầu ứng viên (HDBank Data Analyst)',
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Copy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Công Cụ Phát Hiện & Loại Bỏ Job Trùng Lặp (Deduplication Tool)</h3>
            <p className="text-xs text-slate-400">
              Tự động quét và phát hiện các bài đăng trùng URL gốc hoặc trùng Tên Công Ty + Vị Trí Tuyển Dụng
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-bold flex items-center space-x-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{pairs.length} cặp nghi trùng</span>
        </span>
      </div>

      {pairs.length === 0 ? (
        <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white">Cơ sở dữ liệu hoàn toàn sạch sẽ!</h4>
          <p className="text-xs mt-1">Không phát hiện bản ghi trùng lặp nào trong hệ thống.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pairs.map(pair => (
            <div key={pair.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-bold text-amber-400">Lý do nghi trùng:</span>
                  <span className="text-slate-300">{pair.similarityReason}</span>
                </div>
                <span className="px-2.5 py-0.5 text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-md">
                  Độ tin cậy: {pair.confidence}%
                </span>
              </div>

              {/* Grid 2 Jobs Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Job A */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-emerald-400">Bản ghi A (TopCV)</span>
                    <span className="text-[10px] text-slate-500">{pair.jobA.scrapedAt}</span>
                  </div>
                  <h5 className="font-bold text-white text-sm">{pair.jobA.title}</h5>
                  <p className="text-slate-400">{pair.jobA.companyName} • {pair.jobA.location}</p>
                  <p className="text-amber-400 font-semibold">{pair.jobA.salary}</p>
                </div>

                {/* Job B */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sky-400">Bản ghi B ({pair.jobB.source})</span>
                    <span className="text-[10px] text-slate-500">{pair.jobB.scrapedAt}</span>
                  </div>
                  <h5 className="font-bold text-white text-sm">{pair.jobB.title}</h5>
                  <p className="text-slate-400">{pair.jobB.companyName} • {pair.jobB.location}</p>
                  <p className="text-amber-400 font-semibold">{pair.jobB.salary}</p>
                </div>

              </div>

              {/* Action Handlers */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                <button
                  onClick={() => handleDelete(pair.id, pair.jobB.id)}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 rounded-xl transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa Bản Ghi B (Xóa trùng)</span>
                </button>

                <button
                  onClick={() => handleMerge(pair.id, pair.jobA)}
                  className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-colors"
                >
                  <GitMerge className="w-3.5 h-3.5" />
                  <span>Gộp Dữ Liệu (Merge Job A + B)</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
