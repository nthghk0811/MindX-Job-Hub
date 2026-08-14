import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAnalytics, getCount } from '../../hooks/useAnalytics';

// Skeleton placeholder
const Skeleton = () => (
  <div className="h-8 bg-slate-100 rounded-lg animate-pulse w-24" />
);

export const StatCards: React.FC = () => {
  const { data, loading } = useAnalytics();

  const total       = data?.total ?? 0;
  const newWeek     = data?.newThisWeek ?? 0;

  // Industry counts
  const codeCount   = getCount(data?.byIndustry ?? [], 'Code');
  const dataCount   = getCount(data?.byIndustry ?? [], 'Data Analysis');
  const baCount     = getCount(data?.byIndustry ?? [], 'Business Analysis');

  // Location counts
  const hanoiCount  = getCount(data?.byLocation ?? [], 'Hà Nội');
  const hcmCount    = getCount(data?.byLocation ?? [], 'TP.HCM');
  const remoteCount = getCount(data?.byLocation ?? [], 'Remote');

  // Fit score
  const highFit     = getCount(data?.byFit ?? [], 'High');
  const highPct     = total > 0 ? Math.round((highFit / total) * 100) : 0;

  const STATS = [
    {
      label: 'Tổng job trong DB',
      value: loading ? null : `${total.toLocaleString()}`,
      sub: `${newWeek} job mới trong tuần này`,
      change: newWeek > 0 ? `+${newWeek} tuần này` : 'Cập nhật mới nhất',
      positive: newWeek > 0,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
    {
      label: 'Phân bổ Ngành',
      value: loading ? null : `${codeCount} · ${dataCount} · ${baCount}`,
      sub: 'Code · Data Analysis · BA',
      change: codeCount >= dataCount ? 'Code nhiều nhất' : dataCount >= baCount ? 'Data nhiều nhất' : 'BA nhiều nhất',
      positive: true,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
    },
    {
      label: 'Hà Nội · TP.HCM · Remote',
      value: loading ? null : `${hanoiCount} · ${hcmCount} · ${remoteCount}`,
      sub: 'Phủ sóng 3 hình thức địa điểm',
      change: hanoiCount > hcmCount ? 'Hà Nội dẫn đầu' : 'TP.HCM dẫn đầu',
      positive: true,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'MindX Fit Score ≥ High',
      value: loading ? null : `${highFit} job (${highPct}%)`,
      sub: 'Khớp kỹ năng đầu ra MindX',
      change: highPct >= 50 ? 'Tốt' : highPct >= 30 ? 'Trung bình' : 'Cần cải thiện',
      positive: highPct >= 30,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map(s => (
        <div key={s.label} className={`card p-5 border ${s.border}`}>
          <p className="text-xs font-semibold text-slate-500 mb-2">{s.label}</p>
          {s.value === null
            ? <Skeleton />
            : <p className={`text-2xl font-extrabold ${s.color} leading-none mb-1`}>{s.value}</p>
          }
          <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className={`text-xs font-semibold ${s.positive ? 'text-emerald-600' : 'text-slate-400'}`}>
              {s.change}
            </span>
            {s.positive
              ? <TrendingUp className="w-4 h-4 text-emerald-500" />
              : <Minus className="w-4 h-4 text-slate-400" />
            }
          </div>
        </div>
      ))}
    </div>
  );
};
