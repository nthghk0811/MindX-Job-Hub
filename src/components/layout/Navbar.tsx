import React from 'react';
import { Briefcase, BarChart3, Wrench, Sparkles, BookOpen, Plus } from 'lucide-react';

interface NavbarProps {
  activeTab: 'jobhub' | 'analytics' | 'tools' | 'smart';
  setActiveTab: (tab: 'jobhub' | 'analytics' | 'tools' | 'smart') => void;
  onOpenAddModal: () => void;
  onOpenDocsModal: () => void;
  totalJobsCount: number;
}

const NAV_ITEMS = [
  { id: 'jobhub',    label: 'Job Hub',        icon: Briefcase },
  { id: 'analytics', label: 'Báo cáo',        icon: BarChart3  },
  { id: 'tools',     label: 'Công cụ Admin',  icon: Wrench     },
  { id: 'smart',     label: 'Bản tin & Match', icon: Sparkles  },
] as const;

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenDocsModal,
  totalJobsCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-200">
              <span className="font-black text-white text-sm tracking-tighter">MX</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-900 text-sm">MindX Job Hub</span>
              <div className="text-[10px] text-slate-400 leading-none mt-0.5">Student Success System</div>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="flex-1 flex justify-center">
            <div className="hidden md:flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    activeTab === id
                      ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* DB count badge */}
            <span className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              <span className="font-semibold text-slate-700">{totalJobsCount}</span> jobs
            </span>

            <button
              type="button"
              onClick={onOpenDocsModal}
              className="btn-ghost text-xs"
              title="Tài liệu & Hướng dẫn"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tài liệu</span>
            </button>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="btn-primary text-xs py-1.5 px-3"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Job</span>
            </button>
          </div>

        </div>

        {/* Mobile bottom nav */}
        <div className="flex md:hidden gap-0.5 pb-2 overflow-x-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
