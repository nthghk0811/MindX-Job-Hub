import React from 'react';
import { Database, TrendingUp, PieChart, MapPin } from 'lucide-react';
import { TOTAL_DB_METRICS } from '../../data/mockJobs';

const STATS = [
  {
    label: 'Tổng job trong DB',
    value: `${TOTAL_DB_METRICS.totalJobsInDb}`,
    sub: 'đã kiểm duyệt & lưu trữ',
    change: '+18.4%',
    positive: true,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
  },
  {
    label: 'Job mới trong tuần',
    value: `${TOTAL_DB_METRICS.newJobsThisWeek}`,
    sub: 'cào tự động từ 6 nguồn',
    change: '+12%',
    positive: true,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    label: 'Tỷ lệ Code vs Data',
    value: `${TOTAL_DB_METRICS.codeRatio}% · ${TOTAL_DB_METRICS.dataRatio}%`,
    sub: `Code / Data Analysis / BA ${TOTAL_DB_METRICS.baRatio}%`,
    change: 'Cân bằng',
    positive: true,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    label: 'Hà Nội vs TP.HCM',
    value: `${TOTAL_DB_METRICS.hanoiJobs} · ${TOTAL_DB_METRICS.hcmJobs}`,
    sub: 'Phủ sóng 2 thị trường lớn',
    change: 'Đều',
    positive: true,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
];

export const StatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map(s => (
        <div key={s.label} className={`card p-5 border ${s.border}`}>
          <p className="text-xs font-semibold text-slate-500 mb-2">{s.label}</p>
          <p className={`text-2xl font-extrabold ${s.color} leading-none mb-1`}>{s.value}</p>
          <p className="text-xs text-slate-400">{s.sub}</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className={`text-xs font-semibold ${s.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {s.change}
            </span>
            <TrendingUp className={`w-4 h-4 ${s.positive ? 'text-emerald-500' : 'text-rose-500'}`} />
          </div>
        </div>
      ))}
    </div>
  );
};
