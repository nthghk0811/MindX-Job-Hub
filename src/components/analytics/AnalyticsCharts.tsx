import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';

const INDUSTRY_DATA = [
  { name: 'Lập Trình (Code)', value: 144, color: '#4f46e5' },
  { name: 'Data Analysis', value: 79, color: '#10b981' },
  { name: 'Business Analysis', value: 25, color: '#f59e0b' },
];

const TOP_SKILLS_DATA = [
  { skill: 'SQL', count: 98 },
  { skill: 'ReactJS', count: 86 },
  { skill: 'Python', count: 74 },
  { skill: 'Node.js', count: 68 },
  { skill: 'PowerBI', count: 52 },
  { skill: 'TypeScript', count: 48 },
  { skill: 'Excel Adv', count: 42 },
  { skill: 'Docker', count: 35 },
  { skill: 'BPMN/BA', count: 28 },
  { skill: 'GCP/AWS', count: 24 },
];

const WEEKLY_TREND_DATA = [
  { week: 'T07-W1', Code: 22, Data: 12, BA: 4 },
  { week: 'T07-W2', Code: 28, Data: 15, BA: 5 },
  { week: 'T07-W3', Code: 35, Data: 18, BA: 6 },
  { week: 'T07-W4', Code: 31, Data: 16, BA: 4 },
  { week: 'T08-W1', Code: 40, Data: 22, BA: 8 },
  { week: 'T08-W2', Code: 48, Data: 26, BA: 9 },
];

const MINDX_FIT_DISTRIBUTION = [
  { category: 'Fit Cao (High 90%+)', count: 168, total: 248, fill: '#10b981' },
  { category: 'Fit Trung Bình (70-89%)', count: 62, total: 248, fill: '#f59e0b' },
  { category: 'Cơ Bản (<70%)', count: 18, total: 248, fill: '#f43f5e' },
];

const TOOLTIP_STYLE = {
  backgroundColor: '#fff',
  borderColor: '#e2e8f0',
  borderRadius: '12px',
  color: '#0f172a',
  fontSize: '12px',
  boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)'
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-bold text-slate-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

export const AnalyticsCharts: React.FC = () => {
  return (
    <div className="space-y-5">

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <ChartCard title="Phân bổ Job theo Ngành (%)">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={INDUSTRY_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {INDUSTRY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend formatter={(value) => <span className="text-xs text-slate-600">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Top 10 Kỹ năng được tuyển nhiều nhất">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_SKILLS_DATA} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2">
          <ChartCard title="Xu hướng tuyển dụng Intern / Fresher theo tuần">
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={WEEKLY_TREND_DATA} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend formatter={(value) => <span className="text-xs text-slate-600">{value}</span>} />
                  <Line type="monotone" dataKey="Code" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Data" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="BA" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Fit score distribution */}
        <ChartCard title="MindX Fit Score – Phân bổ">
          <div className="space-y-4 mt-2">
            {MINDX_FIT_DISTRIBUTION.map(item => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.category}</span>
                  <span className="font-bold text-slate-800">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / item.total) * 100}%`, backgroundColor: item.fill }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 leading-relaxed">
            <strong>Nhận xét:</strong> Hơn 67% job cào về hoàn toàn khớp với kỹ năng đầu ra của học viên MindX!
          </div>
        </ChartCard>

      </div>
    </div>
  );
};
