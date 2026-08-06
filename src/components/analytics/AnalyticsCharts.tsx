import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import { Sparkles, TrendingUp, Cpu, Award } from 'lucide-react';

const INDUSTRY_DATA = [
  { name: 'Lập Trình (Code)', value: 144, color: '#f43f5e' },
  { name: 'Phân Tích Dữ Liệu (Data)', value: 79, color: '#10b981' },
  { name: 'Business Analysis (BA)', value: 25, color: '#3b82f6' },
];

const TOP_SKILLS_DATA = [
  { skill: 'SQL', count: 98 },
  { skill: 'ReactJS', count: 86 },
  { skill: 'Python', count: 74 },
  { skill: 'Node.js', count: 68 },
  { skill: 'PowerBI', count: 52 },
  { skill: 'TypeScript', count: 48 },
  { skill: 'Excel Advanced', count: 42 },
  { skill: 'Docker', count: 35 },
  { skill: 'BPMN / BA', count: 28 },
  { skill: 'GCP / AWS', count: 24 },
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
  { category: 'Fit Cao (High 90%+)', count: 168, fill: '#10b981' },
  { category: 'Fit Trung Bình (70%-89%)', count: 62, fill: '#f59e0b' },
  { category: 'Fit Cơ Bản (<70%)', count: 18, fill: '#f43f5e' },
];

export const AnalyticsCharts: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Row 1: Pie & Top Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Industry Distribution Doughnut */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Cpu className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-white text-base">Phân Bổ Thị Trường Job Theo Ngành</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={INDUSTRY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {INDUSTRY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Legend formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 10 Skills Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Top 10 Kỹ Năng / Công Nghệ Được Tuyển Nhiều Nhất</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_SKILLS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="count" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Trend Line Chart & MindX Fit Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Line Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Xu Hướng Tuyển Dụng Intern / Fresher Theo Tuần</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Legend formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
                <Line type="monotone" dataKey="Code" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Data" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="BA" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MindX Fit Score Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Phân Bổ Điểm MindX Fit Score</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Mức độ tương thích giữa JD thị trường và Giáo trình đào tạo tại MindX</p>
          </div>

          <div className="space-y-4">
            {MINDX_FIT_DISTRIBUTION.map(item => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{item.category}</span>
                  <span className="text-white font-bold">{item.count} jobs</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.count / 248) * 100}%`,
                      backgroundColor: item.fill
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            💡 <strong>Nhận xét:</strong> Hơn 67% số job cào về hoàn toàn trùng khớp với bộ kỹ năng đầu ra của học viên MindX!
          </div>
        </div>

      </div>

    </div>
  );
};
