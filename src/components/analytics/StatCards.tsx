import React from 'react';
import { Database, TrendingUp, Code2, PieChart, MapPin, Zap } from 'lucide-react';
import { TOTAL_DB_METRICS } from '../../data/mockJobs';

export const StatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Card 1: Total Jobs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
        <div className="absolute -right-3 -bottom-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Database className="w-24 h-24 text-rose-500" />
        </div>
        <div className="flex items-center space-x-3 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Database className="w-4 h-4" />
          </div>
          <span>Tổng Job Trong DB</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-black text-white">{TOTAL_DB_METRICS.totalJobsInDb}</span>
          <span className="text-xs font-medium text-emerald-400 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            +18.4%
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Đã kiểm duyệt & lưu trữ hệ thống</p>
      </div>

      {/* Card 2: New Jobs this week */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
        <div className="absolute -right-3 -bottom-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Zap className="w-24 h-24 text-amber-500" />
        </div>
        <div className="flex items-center space-x-3 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <span>Job Mới Trong Tuần</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-black text-amber-400">{TOTAL_DB_METRICS.newJobsThisWeek}</span>
          <span className="text-xs font-medium text-amber-300">mới cào tự động</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Crawl từ TopCV, ITviec, LinkedIn...</p>
      </div>

      {/* Card 3: Code vs Data Ratio */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
        <div className="absolute -right-3 -bottom-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Code2 className="w-24 h-24 text-sky-500" />
        </div>
        <div className="flex items-center space-x-3 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <PieChart className="w-4 h-4" />
          </div>
          <span>Tỷ Lệ Code vs Data</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-black text-sky-400">{TOTAL_DB_METRICS.codeRatio}%</span>
          <span className="text-xs text-slate-400">vs</span>
          <span className="text-2xl font-black text-emerald-400">{TOTAL_DB_METRICS.dataRatio}%</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Code ({TOTAL_DB_METRICS.codeRatio}%) | Data ({TOTAL_DB_METRICS.dataRatio}%) | BA (10%)</p>
      </div>

      {/* Card 4: Location Split */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
        <div className="absolute -right-3 -bottom-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <MapPin className="w-24 h-24 text-emerald-500" />
        </div>
        <div className="flex items-center space-x-3 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MapPin className="w-4 h-4" />
          </div>
          <span>Hà Nội vs TP.HCM</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-black text-rose-400">{TOTAL_DB_METRICS.hanoiJobs}</span>
          <span className="text-xs text-slate-400">HN /</span>
          <span className="text-2xl font-black text-emerald-400">{TOTAL_DB_METRICS.hcmJobs}</span>
          <span className="text-xs text-slate-400">HCM</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Phủ sóng 2 thị trường công nghệ lớn nhất</p>
      </div>

    </div>
  );
};
