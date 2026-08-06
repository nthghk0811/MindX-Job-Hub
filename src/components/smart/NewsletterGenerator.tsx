import React, { useState } from 'react';
import { Mail, Copy, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { JobItem } from '../../types/job';
import { generateWeeklyNewsletter } from '../../utils/exportUtils';

interface NewsletterGeneratorProps {
  jobs: JobItem[];
}

export const NewsletterGenerator: React.FC<NewsletterGeneratorProps> = ({ jobs }) => {
  const [copied, setCopied] = useState(false);
  const newsletterContent = generateWeeklyNewsletter(jobs);

  const handleCopy = () => {
    navigator.clipboard.writeText(newsletterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Tạo Bản Tin Job Hàng Tuần (Weekly Job Dispatcher)</h3>
            <p className="text-xs text-slate-400">
              Tự động tổng hợp và định dạng danh sách cơ hội việc làm mới nhất gửi Học viên MindX
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-900/30 transition-all shrink-0"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã Sao Chép Markdown!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Sao Chép Bản Tin (1-Click Copy)</span>
            </>
          )}
        </button>
      </div>

      {/* Editor & Preview Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-slate-300">Định dạng Markdown (Gửi Discord / Telegram / Email)</span>
          <span className="text-emerald-400 flex items-center font-semibold">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Auto Generated từ {jobs.length} bản ghi DB
          </span>
        </div>

        <textarea
          readOnly
          rows={16}
          value={newsletterContent}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none leading-relaxed"
        />
      </div>

    </div>
  );
};
