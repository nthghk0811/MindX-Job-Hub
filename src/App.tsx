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
import { LayoutGrid, Table, GraduationCap, Download, Plus, CheckCircle } from 'lucide-react';

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

  const [selectedJobDetail, setSelectedJobDetail] = useState<JobItem | null>(null);
  const [matchingJob, setMatchingJob] = useState<JobItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const popularSkills = useMemo(() => {
    const skillCounts: Record<string, number> = {};
    jobs.forEach(j => { j.skills.forEach(s => { skillCounts[s] = (skillCounts[s] || 0) + 1; }); });
    return Object.keys(skillCounts).sort((a, b) => skillCounts[b] - skillCounts[a]);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      if (filters.searchKeyword) {
        const kw = filters.searchKeyword.toLowerCase();
        if (!j.title.toLowerCase().includes(kw) && !j.companyName.toLowerCase().includes(kw) && !j.skills.some(s => s.toLowerCase().includes(kw))) return false;
      }
      if (filters.industries.length > 0 && !filters.industries.includes(j.industry)) return false;
      if (filters.levels.length > 0 && !filters.levels.includes(j.level)) return false;
      if (filters.locations.length > 0 && !filters.locations.includes(j.location)) return false;
      if (filters.sources.length > 0 && !filters.sources.includes(j.source)) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(j.status)) return false;
      if (filters.fitScores.length > 0 && !filters.fitScores.includes(j.mindxFitScore)) return false;
      if (filters.selectedSkills.length > 0 && !filters.selectedSkills.some(sk => j.skills.includes(sk))) return false;
      return true;
    });
  }, [jobs, filters]);

  const handleAddJob = (newJob: JobItem) => {
    setJobs(prev => [newJob, ...prev]);
    showToast(`Đã thêm thành công: "${newJob.title}"`);
  };

  const handleUpdateNotes = (jobId: string, notes: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ssNotes: notes } : j));
    if (selectedJobDetail?.id === jobId) setSelectedJobDetail(prev => prev ? { ...prev, ssNotes: notes } : null);
    showToast('Đã lưu ghi chú thành công!');
  };

  const handleUpdateStatus = (jobId: string, status: JobStatusType) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
    if (selectedJobDetail?.id === jobId) setSelectedJobDetail(prev => prev ? { ...prev, status } : null);
    showToast(`Cập nhật trạng thái: "${status}"`);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    showToast('Đã xóa bài tuyển dụng!');
  };

  const handleMergeJobs = (_pairId: string, keepJob: JobItem) => {
    showToast(`Đã gộp job: "${keepJob.title}"`);
  };

  const handleDeleteDuplicate = (_pairId: string, removeJobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== removeJobId));
    showToast('Đã xóa bản ghi trùng lặp!');
  };

  const handleImportJobs = (imported: JobItem[]) => {
    setJobs(prev => [...imported, ...prev]);
    showToast(`Import thành công ${imported.length} jobs!`);
  };

  const handleSendJobToStudent = (studentName: string, jobTitle: string) => {
    showToast(`Đã gửi "${jobTitle}" cho ${studentName}!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-success">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenDocsModal={() => setIsDocsModalOpen(true)}
        totalJobsCount={TOTAL_DB_METRICS.totalJobsInDb}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* TAB 1: JOB HUB */}
        {activeTab === 'jobhub' && (
          <div className="space-y-5">
            <HeroBanner
              totalJobs={jobs.length}
              onOpenDocs={() => setIsDocsModalOpen(true)}
              onQuickSearch={(term) => setFilters(prev => ({ ...prev, searchKeyword: term }))}
            />

            <div className="flex flex-col lg:flex-row gap-5">

              {/* Sidebar */}
              <SidebarFilter
                filters={filters}
                setFilters={setFilters}
                onResetFilters={() => setFilters(INITIAL_FILTER_STATE)}
                popularSkills={popularSkills}
              />

              {/* Main content */}
              <div className="flex-1 space-y-4 min-w-0">

                {/* Control bar */}
                <div className="card px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-800">Danh sách tuyển dụng</h2>
                      <span className="px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-full">
                        {filteredJobs.length} kết quả
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Intern · Fresher · Junior – đã kiểm duyệt</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View toggle */}
                    <div className="flex bg-slate-100 p-0.5 rounded-xl gap-0.5">
                      {[
                        { mode: 'grid', Icon: LayoutGrid, label: 'Card' },
                        { mode: 'table', Icon: Table, label: 'Bảng' },
                        { mode: 'student', Icon: GraduationCap, label: 'Portal' }
                      ].map(({ mode, Icon, label }) => (
                        <button
                          key={mode}
                          type="button"
                          title={label}
                          onClick={() => setViewMode(mode as typeof viewMode)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg font-medium transition-all ${
                            viewMode === mode
                              ? 'bg-white text-indigo-700 shadow-sm'
                              : 'text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{label}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => exportJobsToCSV(filteredJobs)}
                      className="btn-ghost text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Xuất Excel</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="btn-primary text-xs py-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Thêm Job</span>
                    </button>
                  </div>
                </div>

                {/* Job list */}
                {filteredJobs.length === 0 ? (
                  <div className="card p-12 text-center space-y-3">
                    <p className="text-base font-bold text-slate-800">Không tìm thấy kết quả nào</p>
                    <p className="text-sm text-slate-500">Thử xóa bộ lọc hoặc thay đổi từ khóa tìm kiếm.</p>
                    <button
                      type="button"
                      onClick={() => setFilters(INITIAL_FILTER_STATE)}
                      className="btn-secondary text-xs mx-auto"
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

        {/* TAB 2: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Báo cáo thị trường Job</h1>
              <p className="text-sm text-slate-500 mt-0.5">Phân tích xu hướng tuyển dụng Intern/Fresher – cập nhật theo thời gian thực.</p>
            </div>
            <StatCards />
            <AnalyticsCharts />
          </div>
        )}

        {/* TAB 3: TOOLS */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Công cụ Quản trị Hệ thống</h1>
              <p className="text-sm text-slate-500 mt-0.5">Cào job tự động, phát hiện trùng lặp, Import/Export dữ liệu.</p>
            </div>
            <ScraperController />
            <DeduplicationTool
              jobs={jobs}
              onMergeJobs={handleMergeJobs}
              onDeleteDuplicate={handleDeleteDuplicate}
            />
            <ImportExport jobs={jobs} onImportJobs={handleImportJobs} />
          </div>
        )}

        {/* TAB 4: SMART / NEWSLETTER */}
        {activeTab === 'smart' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Bản tin & Match Học viên</h1>
              <p className="text-sm text-slate-500 mt-0.5">Tạo newsletter job và gợi ý học viên phù hợp với AI.</p>
            </div>
            <NewsletterGenerator jobs={jobs} />
          </div>
        )}

      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        <p>© 2026 MindX Technology Education · SS Hub v2.4 · Hệ thống nội bộ, không phát tán ra ngoài</p>
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
