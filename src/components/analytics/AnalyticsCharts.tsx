import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useAnalytics, getCount } from '../../hooks/useAnalytics';

const TOOLTIP_STYLE = {
  backgroundColor: '#fff',
  borderColor: '#e2e8f0',
  borderRadius: '12px',
  color: '#0f172a',
  fontSize: '12px',
  boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
};

function ChartCard({ title, children, loading }: { title: string; children: React.ReactNode; loading?: boolean }) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-bold text-slate-800 mb-4">{title}</h3>
      {loading
        ? <div className="h-60 flex items-center justify-center">
            <div className="w-full h-48 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        : children
      }
    </div>
  );
}

export const AnalyticsCharts: React.FC = () => {
  const { data, loading } = useAnalytics();

  // ── Industry pie data ──────────────────────────────
  const industryData = [
    { name: 'Code', value: getCount(data?.byIndustry ?? [], 'Code'), color: '#4f46e5' },
    { name: 'Data Analysis', value: getCount(data?.byIndustry ?? [], 'Data Analysis'), color: '#10b981' },
    { name: 'Business Analysis', value: getCount(data?.byIndustry ?? [], 'Business Analysis'), color: '#f59e0b' },
  ].filter(d => d.value > 0);

  // ── Top skills bar data ────────────────────────────
  const skillsData = (data?.topSkills ?? [])
    .slice(0, 10)
    .map(s => ({ skill: s._id.length > 10 ? s._id.slice(0, 10) + '…' : s._id, count: s.count, fullName: s._id }));

  // ── Level bar data ────────────────────────────────
  const levelData = [
    { name: 'Intern',   count: getCount(data?.byLevel ?? [], 'Intern'),   fill: '#4f46e5' },
    { name: 'Fresher',  count: getCount(data?.byLevel ?? [], 'Fresher'),  fill: '#10b981' },
    { name: 'Junior',   count: getCount(data?.byLevel ?? [], 'Junior'),   fill: '#f59e0b' },
  ];

  // ── Fit score bars ────────────────────────────────
  const total   = data?.total ?? 1;
  const highFit = getCount(data?.byFit ?? [], 'High');
  const medFit  = getCount(data?.byFit ?? [], 'Medium');
  const lowFit  = getCount(data?.byFit ?? [], 'Low');
  const fitDist = [
    { category: 'High — Khớp tốt kỹ năng MindX', count: highFit,  pct: Math.round(highFit  / total * 100), fill: '#10b981' },
    { category: 'Medium — Phù hợp một phần',       count: medFit,  pct: Math.round(medFit   / total * 100), fill: '#f59e0b' },
    { category: 'Low — Cần bổ sung thêm',          count: lowFit,  pct: Math.round(lowFit   / total * 100), fill: '#f43f5e' },
  ];

  // ── Location bar ──────────────────────────────────
  const locationData = (data?.byLocation ?? [])
    .map(l => ({ name: l._id, count: l.count }))
    .sort((a, b) => b.count - a.count);

  // ── Source bar ────────────────────────────────────
  const sourceData = (data?.bySource ?? [])
    .map(s => ({ name: s._id, count: s.count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-5">

      {/* Row 1: Industry pie + Top Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <ChartCard title="Phân bổ Job theo Ngành" loading={loading}>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={industryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {industryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value: any, name: any) => [`${value} jobs`, name]}
                />
                <Legend formatter={(value) => <span className="text-xs text-slate-600">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Summary pills */}
          {!loading && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {industryData.map(d => (
                <span key={d.name} className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: d.color + '18', color: d.color }}>
                  {d.name}: {d.value}
                </span>
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard title="Top 10 Kỹ năng được tuyển nhiều nhất" loading={loading}>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value: any, _: any, props: any) => [
                    `${value} jobs`, props.payload?.fullName || props.payload?.skill
                  ]}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

      </div>

      {/* Row 2: Level bar + Location + Source */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <ChartCard title="Phân bổ theo Level" loading={loading}>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`${v} jobs`]} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {levelData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Phân bổ theo Địa điểm" loading={loading}>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 11 }} width={56} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`${v} jobs`]} />
                <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="MindX Fit Score" loading={loading}>
          <div className="space-y-4 mt-2">
            {fitDist.map(item => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700 leading-snug">{item.category}</span>
                  <span className="font-bold text-slate-800 ml-2 shrink-0">{item.count} ({item.pct}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.pct}%`, backgroundColor: item.fill }}
                  />
                </div>
              </div>
            ))}
          </div>
          {!loading && (
            <div className="mt-4 p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-800 leading-relaxed">
              <strong>Nhận xét:</strong>{' '}
              {highFit} jobs ({Math.round(highFit / total * 100)}%) khớp tốt kỹ năng đầu ra MindX.
              {' '}{medFit} jobs phù hợp một phần, cần review thêm trước khi gửi học viên.
            </div>
          )}
        </ChartCard>

      </div>

      {/* Row 3: Source distribution */}
      <ChartCard title="Phân bổ theo Nguồn thu thập" loading={loading}>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceData} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`${v} jobs`]} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

    </div>
  );
};
