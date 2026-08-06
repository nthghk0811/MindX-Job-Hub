import React, { useState } from 'react';
import { Play, RefreshCw, Terminal } from 'lucide-react';
import { ScraperStatus } from '../../types/job';

const INITIAL_SOURCES: ScraperStatus[] = [
  { id: 's1', name: 'TopCV', url: 'https://topcv.vn/tim-viec-lam-it-intern', lastScraped: '10 phút trước', totalJobsScraped: 112, status: 'Idle', color: 'text-emerald-600' },
  { id: 's2', name: 'ITviec', url: 'https://itviec.com/jobs/intern-fresher', lastScraped: '25 phút trước', totalJobsScraped: 68, status: 'Idle', color: 'text-rose-600' },
  { id: 's3', name: 'LinkedIn', url: 'https://linkedin.com/jobs/search?keywords=Intern', lastScraped: '1 giờ trước', totalJobsScraped: 45, status: 'Idle', color: 'text-sky-600' },
  { id: 's4', name: 'VietnamWorks', url: 'https://vietnamworks.com/job-intern', lastScraped: '2 giờ trước', totalJobsScraped: 32, status: 'Idle', color: 'text-amber-600' },
  { id: 's5', name: 'Ybox', url: 'https://ybox.vn/tuyen-dung', lastScraped: '30 phút trước', totalJobsScraped: 24, status: 'Idle', color: 'text-violet-600' },
  { id: 's6', name: 'Facebook Group', url: 'https://facebook.com/groups/jobitvietnam', lastScraped: '15 phút trước', totalJobsScraped: 19, status: 'Idle', color: 'text-blue-600' },
];

export const ScraperController: React.FC = () => {
  const [sources, setSources] = useState<ScraperStatus[]>(INITIAL_SOURCES);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Scraper Engine v2.4 đã sẵn sàng.',
    '[SYSTEM] Đã kết nối Database MindX Hub – 18 trường dữ liệu.',
  ]);

  const startScraping = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);
    setLogs(prev => [...prev, '[CRAWLER] Bắt đầu 6 tiến trình cào dữ liệu...']);

    let currentProg = 0;
    const interval = setInterval(() => {
      currentProg += 15;
      setProgress(Math.min(currentProg, 100));

      if (currentProg === 30) setLogs(prev => [...prev, '[TOPCV] Crawled 12 jobs mới: "ReactJS Intern", "Node.js Trainee"...']);
      else if (currentProg === 60) setLogs(prev => [...prev, '[ITVIEC] Extracted 8 JDs. Chấm MindX Fit Score thành công.']);
      else if (currentProg === 90) setLogs(prev => [...prev, '[LINKEDIN] Extracted 5 JDs. Chạy thuật toán Lọc Trùng...']);

      if (currentProg >= 100) {
        clearInterval(interval);
        setIsRunning(false);
        setLogs(prev => [...prev, '[SUCCESS] Hoàn thành! +25 jobs mới đã vào Database MindX.']);
        setSources(prev => prev.map(s => ({ ...s, status: 'Success', totalJobsScraped: s.totalJobsScraped + 4 })));
      }
    }, 800);
  };

  return (
    <div className="card p-6 space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Trình Cào Dữ Liệu Tự Động</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Thu thập tin tuyển dụng công khai từ 6 nguồn – chuẩn hóa 18 trường – ghi vào Database.
          </p>
        </div>

        <button
          type="button"
          disabled={isRunning}
          onClick={startScraping}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            isRunning
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'btn-primary'
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Đang cào... ({progress}%)
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              Bắt đầu cào ngay
            </>
          )}
        </button>
      </div>

      {/* Progress bar */}
      {isRunning && (
        <div className="space-y-1.5 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-indigo-700">Tiến độ thu thập dữ liệu</span>
            <span className="text-indigo-900">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-indigo-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Source grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sources.map(src => (
          <div key={src.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-xs ${src.color}`}>{src.name}</span>
                <span className="text-[10px] text-slate-400">({src.totalJobsScraped} jobs)</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate mt-0.5 max-w-[160px]">{src.url}</p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full shrink-0">
              Ready
            </span>
          </div>
        ))}
      </div>

      {/* Terminal log */}
      <div className="bg-slate-900 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold border-b border-slate-700 pb-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          Live Log
        </div>
        <div className="h-36 overflow-y-auto font-mono text-[11px] space-y-1 pr-1">
          {logs.map((log, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-slate-600 select-none shrink-0">&gt;</span>
              <span className={
                log.includes('SUCCESS') ? 'text-emerald-400 font-bold' :
                log.includes('TOPCV')   ? 'text-sky-300' :
                log.includes('SYSTEM')  ? 'text-slate-400' :
                'text-slate-300'
              }>{log}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
