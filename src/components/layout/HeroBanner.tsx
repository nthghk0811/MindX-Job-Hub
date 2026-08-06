import React from 'react';
import { Database, ShieldCheck, TrendingUp, Search, BookOpen, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  totalJobs: number;
  onOpenDocs: () => void;
  onQuickSearch: (term: string) => void;
}

const QUICK_SEARCHES = ['ReactJS', 'Node.js', 'Data Analyst', 'SQL', 'Hà Nội', 'TP.HCM'];

export const HeroBanner: React.FC<HeroBannerProps> = ({ totalJobs, onOpenDocs, onQuickSearch }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-2xl px-6 py-8 shadow-md shadow-indigo-200 mb-5">
      {/* Subtle decorative circle */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">

        {/* Headline */}
        <div>
          <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2">
            MindX Student Success · Internal Tool
          </p>
          <h1 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight">
            Nguồn Job Intern & Fresher tập trung<br className="hidden sm:block" />
            cho học viên MindX
          </h1>
          <p className="mt-2 text-indigo-200 text-sm leading-relaxed max-w-xl">
            Tự động thu thập từ TopCV, ITviec, LinkedIn, VietnamWorks... Chuẩn hóa 18 trường dữ liệu và gợi ý học viên phù hợp cho Team SS.
          </p>
        </div>

        {/* Trust signals – text-only, no icon overload */}
        <div className="flex flex-wrap gap-3">
          <span className="text-xs font-semibold text-indigo-100 bg-white/10 border border-white/20 px-3 py-1 rounded-full">
            {totalJobs}+ jobs đã kiểm duyệt
          </span>
          <span className="text-xs font-semibold text-indigo-100 bg-white/10 border border-white/20 px-3 py-1 rounded-full">
            Link gốc 100% xác minh
          </span>
          <span className="text-xs font-semibold text-indigo-100 bg-white/10 border border-white/20 px-3 py-1 rounded-full">
            67%+ khớp giáo trình MindX
          </span>
        </div>

        {/* Quick search pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-indigo-300 text-xs font-medium">Tìm nhanh:</span>
          {QUICK_SEARCHES.map(term => (
            <button
              key={term}
              type="button"
              onClick={() => onQuickSearch(term)}
              className="px-2.5 py-1 text-xs font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
            >
              {term}
            </button>
          ))}

          <button
            type="button"
            onClick={onOpenDocs}
            className="ml-auto flex items-center gap-1 text-xs font-semibold text-indigo-200 hover:text-white transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Xem hướng dẫn
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
