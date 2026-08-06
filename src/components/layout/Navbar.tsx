import React from 'react';
import { Briefcase, BarChart3, Wrench, Sparkles, BookOpen, Layers, Search, Bell } from 'lucide-react';

interface NavbarProps {
  activeTab: 'jobhub' | 'analytics' | 'tools' | 'smart';
  setActiveTab: (tab: 'jobhub' | 'analytics' | 'tools' | 'smart') => void;
  onOpenAddModal: () => void;
  onOpenDocsModal: () => void;
  totalJobsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenDocsModal,
  totalJobsCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-900/30">
              <span className="font-black text-white text-xl tracking-tighter">MX</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-lg tracking-tight">MindX Job Hub</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full">
                  SS System
                </span>
              </div>
              <p className="text-xs text-slate-400">Hệ thống Quản lý Job Tuyển dụng & Hỗ trợ Học viên</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex space-x-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('jobhub')}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'jobhub'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Job Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'analytics'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'tools'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Tools & Admin</span>
            </button>

            <button
              onClick={() => setActiveTab('smart')}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'smart'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Bản tin Tuần & Smart Match</span>
            </button>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenDocsModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-colors"
              title="Xem Tài liệu HDSD & Slide Thuyết trình"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tài liệu & Slide</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-lg transition-all shadow-md shadow-rose-900/30"
            >
              <span>+ Thêm Job</span>
            </button>

            <div className="hidden lg:flex items-center space-x-2 pl-3 border-l border-slate-800 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>DB: <strong className="text-white font-semibold">{totalJobsCount}</strong> jobs</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
