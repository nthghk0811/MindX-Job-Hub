import React, { useState } from 'react';
import { Play, Terminal, CheckCircle2, RefreshCw, Globe, AlertCircle } from 'lucide-react';
import { ScraperStatus, SourceType } from '../../types/job';

const INITIAL_SOURCES: ScraperStatus[] = [
  { id: 's1', name: 'TopCV', url: 'https://topcv.vn/tim-viec-lam-it-intern', lastScraped: '10 phút trước', totalJobsScraped: 112, status: 'Idle', color: 'text-emerald-400' },
  { id: 's2', name: 'ITviec', url: 'https://itviec.com/jobs/intern-fresher', lastScraped: '25 phút trước', totalJobsScraped: 68, status: 'Idle', color: 'text-rose-400' },
  { id: 's3', name: 'LinkedIn', url: 'https://linkedin.com/jobs/search?keywords=Intern', lastScraped: '1 giờ trước', totalJobsScraped: 45, status: 'Idle', color: 'text-sky-400' },
  { id: 's4', name: 'VietnamWorks', url: 'https://vietnamworks.com/job-intern', lastScraped: '2 giờ trước', totalJobsScraped: 32, status: 'Idle', color: 'text-amber-400' },
  { id: 's5', name: 'Ybox', url: 'https://ybox.vn/tuyen-dung', lastScraped: '30 phút trước', totalJobsScraped: 24, status: 'Idle', color: 'text-purple-400' },
  { id: 's6', name: 'Facebook Group', url: 'https://facebook.com/groups/jobitvietnam', lastScraped: '15 phút trước', totalJobsScraped: 19, status: 'Idle', color: 'text-blue-400' },
];

export const ScraperController: React.FC = () => {
  const [sources, setSources] = useState<ScraperStatus[]>(INITIAL_SOURCES);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Trình cào dữ liệu tự động (Job Scraper Engine v2.4) sẵn sàng.',
    '[SYSTEM] Đã kết nối Database MindX Hub và định dạng 18 trường dữ liệu.'
  ]);

  const startScraping = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);
    setLogs(prev => [...prev, `[CRAWLER] Bắt đầu kích hoạt 6 tiến trình cào dữ liệu...`]);

    let currentProg = 0;
    const interval = setInterval(() => {
      currentProg += 15;
      setProgress(Math.min(currentProg, 100));

      if (currentProg === 30) {
        setLogs(prev => [...prev, `[TOPCV] Crawled 12 mới: "ReactJS Intern", "Node.js Trainee"...`]);
      } else if (currentProg === 60) {
        setLogs(prev => [...prev, `[ITVIEC] Extracted 8 JDs. Tự động chấm MindX Fit Score thành công.`]);
      } else if (currentProg === 90) {
        setLogs(prev => [...prev, `[LINKEDIN] Extracted 5 JDs. Đang chạy thuật toán Lọc Trùng Job...`]);
      }

      if (currentProg >= 100) {
        clearInterval(interval);
        setIsRunning(false);
        setLogs(prev => [
          ...prev,
          `[SUCCESS] Hoàn thành cào dữ liệu! Đã tổng hợp +25 job mới vào Database MindX.`
        ]);
        setSources(prev => prev.map(s => ({ ...s, status: 'Success', totalJobsScraped: s.totalJobsScraped + 4 })));
      }
    }, 800);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Top Banner & Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-white">Trình Quản Lý Cào Dữ Liệu Tự Động (Scraper Engine)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tự động lấy tin tuyển dụng công khai từ 6 nguồn lớn, chuẩn hóa 18 trường dữ liệu và ghi vào DB
          </p>
        </div>

        <button
          disabled={isRunning}
          onClick={startScraping}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            isRunning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-900/40'
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Đang Cào Dữ Liệu... ({progress}%)</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt Đầu Cào Dữ Liệu Ngay</span>
            </>
          )}
        </button>
      </div>

      {/* Animated Progress Bar */}
      {isRunning && (
        <div className="space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-rose-400">Tiến độ cào dữ liệu thời gian thực</span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Crawl Target Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {sources.map(src => (
          <div key={src.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className={`font-bold text-xs ${src.color}`}>{src.name}</span>
                <span className="text-[10px] text-slate-500">({src.totalJobsScraped} jobs)</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[180px] mt-0.5">{src.url}</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
              Ready
            </span>
          </div>
        ))}
      </div>

      {/* Terminal Live Output Log */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold border-b border-slate-800 pb-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Realtime Live Terminal Logs</span>
        </div>
        <div className="h-36 overflow-y-auto font-mono text-[11px] space-y-1 text-slate-300 pr-2">
          {logs.map((log, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-slate-600 select-none">&gt;</span>
              <span className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('TOPCV') ? 'text-sky-300' : ''}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
