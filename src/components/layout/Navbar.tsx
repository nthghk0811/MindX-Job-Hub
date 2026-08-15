import React from 'react';
import { Briefcase, BarChart3, Wrench, Sparkles, Plus, UserPlus, LogOut, User } from 'lucide-react';

interface NavbarProps {
  activeTab: 'jobhub' | 'analytics' | 'tools' | 'smart';
  setActiveTab: (tab: 'jobhub' | 'analytics' | 'tools' | 'smart') => void;
  onOpenAddJobModal: () => void;
  onOpenAddStudentModal: () => void;
  totalJobsCount: number;
  currentUser?: string | null;
  onLogout?: () => void;
}

const NAV_ITEMS = [
  { id: 'jobhub',    label: 'Job Hub',            icon: Briefcase },
  { id: 'analytics', label: 'Báo cáo',            icon: BarChart3  },
  { id: 'tools',     label: 'Quản lý Dữ liệu',    icon: Wrench     },
  { id: 'smart',     label: 'Bản tin Tuyển dụng', icon: Sparkles  },
] as const;

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddJobModal,
  onOpenAddStudentModal,
  totalJobsCount,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">

          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-200">
              <span className="font-black text-white text-sm tracking-tighter">MX</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-900 text-sm tracking-tight">MindX Job Hub</span>
              <div className="text-[10px] text-slate-400 leading-none">Student Success System</div>
            </div>
          </div>

          {/* Centered Navigation Tabs */}
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

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* DB count badge */}
            <span className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="font-semibold text-slate-700">{totalJobsCount.toLocaleString()}</span> jobs
            </span>

            {/* + Add Student Button */}
            <button
              type="button"
              onClick={onOpenAddStudentModal}
              className="btn-secondary text-xs py-1.5 px-3 gap-1.5 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              title="Thêm hoặc Import danh sách học viên"
            >
              <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline font-medium">Học viên</span>
            </button>

            {/* + Add Job Button */}
            <button
              type="button"
              onClick={onOpenAddJobModal}
              className="btn-primary text-xs py-1.5 px-3.5 gap-1.5 shadow-sm shadow-indigo-200"
              title="Thêm bài tuyển dụng mới"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Job</span>
            </button>

            {/* User Profile & Logout */}
            {currentUser && onLogout && (
              <div className="flex items-center pl-2 ml-1 border-l border-slate-200 gap-1.5">
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/80 px-2 py-1 rounded-lg text-xs font-semibold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                    A
                  </div>
                  <span>{currentUser}</span>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Mobile bottom nav */}
        <div className="flex md:hidden gap-1 pb-2 overflow-x-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'bg-indigo-600 text-white shadow-sm'
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
