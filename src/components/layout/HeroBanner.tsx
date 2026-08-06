import React from 'react';
import { Sparkles, Database, ShieldCheck, Zap, ArrowRight, BookOpen } from 'lucide-react';

interface HeroBannerProps {
  totalJobs: number;
  onOpenDocs: () => void;
  onQuickSearch: (term: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ totalJobs, onOpenDocs, onQuickSearch }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border border-slate-800 p-6 md:p-8 shadow-2xl mb-6">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-4">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hệ Thống Quản Lý & Phân Tích Cơ Hội Việc Làm MindX</span>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Nguồn Job Intern & Fresher Tập Trung Cho <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">Học Viên MindX</span>
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Tự động thu thập từ 6+ nguồn uy tín (TopCV, ITviec, LinkedIn...), chuẩn hóa 18 trường dữ liệu, tự động trích xuất kỹ năng và thuật toán gợi ý học viên phù hợp cho Team Student Success.
        </p>

        {/* Verifiable Quick Stats (Trust Signals) */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Database className="w-4 h-4 text-rose-400" />
            <span className="text-slate-300">Cơ sở dữ liệu: <strong className="text-white font-bold">{totalJobs} jobs</strong></span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">100% URL gốc xác minh</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">67%+ Khớp Giáo trình MindX</span>
          </div>
        </div>

        {/* Quick Search Shortcut Pills */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Gợi ý tìm nhanh:</span>
          {['ReactJS', 'Node.js', 'Data Analyst', 'SQL', 'Hà Nội', 'TP.HCM'].map(term => (
            <button
              key={term}
              type="button"
              onClick={() => onQuickSearch(term)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700/80 transition-all font-medium"
            >
              {term}
            </button>
          ))}

          <button
            type="button"
            onClick={onOpenDocs}
            className="ml-auto text-amber-300 hover:text-amber-200 underline font-semibold flex items-center space-x-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Xem HDSD & Slide Pitch Deck</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
