import React, { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';
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
    <div className="card p-6 space-y-5">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Bản tin Job hàng tuần</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng hợp tự động định dạng Markdown từ {jobs.length} jobs — gửi qua Discord / Telegram / Email.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 font-semibold text-xs rounded-xl transition-all shrink-0 ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'btn-primary'
          }`}
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Đã sao chép!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Sao chép Markdown
            </>
          )}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold uppercase tracking-wider">Nội dung Markdown</span>
          <span className="text-indigo-600 font-semibold">Auto Generated · {jobs.length} bản ghi</span>
        </div>
        <textarea
          readOnly
          rows={16}
          value={newsletterContent}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none leading-relaxed"
        />
      </div>

    </div>
  );
};
