import React, { useState, useMemo } from 'react';
import { Navbar } from './components/layout/Navbar';
import { SidebarFilter } from './components/layout/SidebarFilter';
import { JobCard } from './components/jobhub/JobCard';
import { JobTableView } from './components/jobhub/JobTableView';
import { StudentPortalView } from './components/jobhub/StudentPortalView';
import { JobDetailModal } from './components/jobhub/JobDetailModal';
import { AddJobModal } from './components/jobhub/AddJobModal';
import { StudentMatchModal } from './components/jobhub/StudentMatchModal';
import { StatCards } from './components/analytics/StatCards';
import { AnalyticsCharts } from './components/analytics/AnalyticsCharts';
import { ScraperController } from './components/tools/ScraperController';
import { ImportExport } from './components/tools/ImportExport';
import { DeduplicationTool } from './components/tools/DeduplicationTool';
import { NewsletterGenerator } from './components/smart/NewsletterGenerator';
import { SystemDocsModal } from './components/docs/SystemDocsModal';

import { HeroBanner } from './components/layout/HeroBanner';

import { INITIAL_MOCK_JOBS, TOTAL_DB_METRICS } from './data/mockJobs';
import { INITIAL_MOCK_STUDENTS } from './data/mockStudents';
import { JobItem, FilterState, JobStatusType } from './types/job';
import { exportJobsToCSV } from './utils/exportUtils';
import { LayoutGrid, Table, GraduationCap, Download, Plus, CheckCircle2 } from 'lucide-react';

const INITIAL_FILTER_STATE: FilterState = {
  searchKeyword: '',
  industries: [],
  levels: [],
  locations: [],
  employmentTypes: [],
  salaryRange: '',
  sources: [],
  statuses: [],
  fitScores: [],
  selectedSkills: []
};

export default function App() {
  const [jobs, setJobs] = useState<JobItem[]>(INITIAL_MOCK_JOBS);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [activeTab, setActiveTab] = useState<'jobhub' | 'analytics' | 'tools' | 'smart'>('jobhub');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'student'>('grid');

  // Modals state
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobItem | null>(null);
  const [matchingJob, setMatchingJob] = useState<JobItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Popular skills tag cloud list
  const popularSkills = useMemo(() => {
    const skillCounts: Record<string, number> = {};
    jobs.forEach(j => {
      j.skills.forEach(s => {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      });
    });
    return Object.keys(skillCounts).sort((a, b) => skillCounts[b] - skillCounts[a]);
  }, [jobs]);

  // Filter Jobs Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      // Keyword search
      if (filters.searchKeyword) {
        const kw = filters.searchKeyword.toLowerCase();
        const matchTitle = j.title.toLowerCase().includes(kw);
        const matchCompany = j.companyName.toLowerCase().includes(kw);
        const matchSkill = j.skills.some(s => s.toLowerCase().includes(kw));
        if (!matchTitle && !matchCompany && !matchSkill) return false;
      }

      // Industries
      if (filters.industries.length > 0 && !filters.industries.includes(j.industry)) return false;

      // Levels
      if (filters.levels.length > 0 && !filters.levels.includes(j.level)) return false;

      // Locations
      if (filters.locations.length > 0 && !filters.locations.includes(j.location)) return false;

      // Sources
      if (filters.sources.length > 0 && !filters.sources.includes(j.source)) return false;

      // Statuses
      if (filters.statuses.length > 0 && !filters.statuses.includes(j.status)) return false;

      // Fit Scores
      if (filters.fitScores.length > 0 && !filters.fitScores.includes(j.mindxFitScore)) return false;

      // Selected Skills (AND / OR filter)
      if (filters.selectedSkills.length > 0) {
        const hasSkill = filters.selectedSkills.some(sk => j.skills.includes(sk));
        if (!hasSkill) return false;
      }

      return true;
    });
  }, [jobs, filters]);

  // Action Handlers
  const handleAddJob = (newJob: JobItem) => {
    setJobs(prev => [newJob, ...prev]);
    showToast(`Đã thêm thành công job: "${newJob.title}"`);
  };

  const handleUpdateNotes = (jobId: string, notes: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ssNotes: notes } : j));
    if (selectedJobDetail?.id === jobId) {
      setSelectedJobDetail(prev => prev ? { ...prev, ssNotes: notes } : null);
    }
    showToast('Đã lưu Ghi chú SS thành công!');
  };

  const handleUpdateStatus = (jobId: string, status: JobStatusType) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
    if (selectedJobDetail?.id === jobId) {
      setSelectedJobDetail(prev => prev ? { ...prev, status } : null);
    }
    showToast(`Đã đổi trạng thái thành: "${status}"`);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    showToast('Đã xóa bài tuyển dụng khỏi hệ thống!');
  };

  const handleMergeJobs = (_pairId: string, keepJob: JobItem) => {
    showToast(`Đã gộp dữ liệu thành công cho job: "${keepJob.title}"`);
  };

  const handleDeleteDuplicate = (_pairId: string, removeJobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== removeJobId));
    showToast('Đã xóa bản ghi trùng lặp!');
  };

  const handleImportJobs = (imported: JobItem[]) => {
    setJobs(prev => [...imported, ...prev]);
    showToast(`Đã import thành công ${imported.length} job từ file Excel!`);
  };

  const handleSendJobToStudent = (studentName: string, jobTitle: string) => {
    showToast(`Đã gửi thông tin job "${jobTitle}" cho học viên ${studentName}!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-rose-600 text-white px-4 py-3 rounded-2xl shadow-2xl border border-rose-400 text-xs font-bold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenDocsModal={() => setIsDocsModalOpen(true)}
        totalJobsCount={TOTAL_DB_METRICS.totalJobsInDb}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: JOB HUB (Focus Screen) */}
        {activeTab === 'jobhub' && (
          <div className="space-y-6">
            
            {/* Hero Value Proposition Banner */}
            <HeroBanner
              totalJobs={jobs.length}
              onOpenDocs={() => setIsDocsModalOpen(true)}
              onQuickSearch={(term) => setFilters(prev => ({ ...prev, searchKeyword: term }))}
            />

            <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Left Filter Sidebar */}
            <SidebarFilter
              filters={filters}
              setFilters={setFilters}
              onResetFilters={() => setFilters(INITIAL_FILTER_STATE)}
              popularSkills={popularSkills}
            />

            {/* Right Main Content Area */}
            <div className="flex-1 space-y-5">
              
              {/* Header Bar Controls */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-white">Danh Sách Job Tuyển Dụng</h2>
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                      Tất cả {filteredJobs.length} công việc
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hiển thị các bài tuyển dụng Intern / Fresher / Junior đã được kiểm duyệt
                  </p>
                </div>

                {/* Right controls: View mode switcher & Export button */}
                <div className="flex items-center space-x-3">
                  
                  {/* View Mode Switcher */}
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setViewMode('grid')}
                      title="Grid View (Card dạng ảnh)"
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === 'grid' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      title="Table View (Dạng bảng admin)"
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === 'table' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Table className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('student')}
                      title="Student Portal View (Kiểu NEU Jobs)"
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === 'student' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Action Quick Buttons */}
                  <button
                    onClick={() => exportJobsToCSV(filteredJobs)}
                    className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 rounded-xl transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Xuất Excel</span>
                  </button>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">+ Thêm Job</span>
                  </button>

                </div>
              </div>

              {/* View Modes Rendering */}
              {filteredJobs.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
                  <p className="text-base font-semibold text-white">Không tìm thấy công việc nào phù hợp với bộ lọc!</p>
                  <p className="text-xs">Vui lòng thử reset bộ lọc hoặc tìm kiếm từ khóa khác.</p>
                  <button
                    onClick={() => setFilters(INITIAL_FILTER_STATE)}
                    className="px-4 py-2 bg-slate-800 text-rose-400 font-semibold text-xs rounded-xl hover:bg-slate-700"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredJobs.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSelectJob={setSelectedJobDetail}
                      onMatchStudent={setMatchingJob}
                    />
                  ))}
                </div>
              ) : viewMode === 'table' ? (
                <JobTableView
                  jobs={filteredJobs}
                  onSelectJob={setSelectedJobDetail}
                  onMatchStudent={setMatchingJob}
                  onDeleteJob={handleDeleteJob}
                />
              ) : (
                <StudentPortalView
                  jobs={filteredJobs}
                  onSelectJob={setSelectedJobDetail}
                />
              )}

            </div>

          </div>
        </div>
        )}

        {/* TAB 2: ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <StatCards />
            <AnalyticsCharts />
          </div>
        )}

        {/* TAB 3: TOOLS & SYSTEM ADMIN */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <ScraperController />
            <DeduplicationTool
              jobs={jobs}
              onMergeJobs={handleMergeJobs}
              onDeleteDuplicate={handleDeleteDuplicate}
            />
            <ImportExport jobs={jobs} onImportJobs={handleImportJobs} />
          </div>
        )}

        {/* TAB 4: SMART NEWSLETTER & MATCH */}
        {activeTab === 'smart' && (
          <div className="space-y-6">
            <NewsletterGenerator jobs={jobs} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 MindX Technology Education • Hệ thống Thu thập & Quản lý Job Tuyển dụng (SS Hub v2.4)</p>
      </footer>

      {/* Modals */}
      <JobDetailModal
        job={selectedJobDetail}
        onClose={() => setSelectedJobDetail(null)}
        onUpdateSsNotes={handleUpdateNotes}
        onUpdateStatus={handleUpdateStatus}
        onMatchStudent={setMatchingJob}
        onDeleteJob={handleDeleteJob}
      />

      <AddJobModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddJob={handleAddJob}
      />

      <StudentMatchModal
        job={matchingJob}
        students={INITIAL_MOCK_STUDENTS}
        onClose={() => setMatchingJob(null)}
        onSendJobToStudent={handleSendJobToStudent}
      />

      <SystemDocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

    </div>
  );
}
