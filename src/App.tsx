import React, { useState, useMemo } from 'react';
import { Navbar } from './components/layout/Navbar';
import { FilterBar } from './components/layout/FilterBar';
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

import { INITIAL_MOCK_JOBS, TOTAL_DB_METRICS } from './data/mockJobs';
import { INITIAL_MOCK_STUDENTS } from './data/mockStudents';
import { JobItem, FilterState, JobStatusType } from './types/job';
import { exportJobsToCSV } from './utils/exportUtils';
import { LayoutGrid, Table, GraduationCap, Download, CheckCircle } from 'lucide-react';

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
      if (filters.employmentTypes.length > 0 && !filters.employmentTypes.includes(j.employmentType)) return false;
      if (filters.sources.length > 0 && !filters.sources.includes(j.source)) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(j.status)) return false;
      if (filters.fitScores.length > 0 && !filters.fitScores.includes(j.mindxFitScore)) return false;
      if (filters.selectedSkills.length > 0 && !filters.selectedSkills.some(sk => j.skills.includes(sk))) return false;
      return true;
    });
  }, [jobs, filters]);

  const handleAddJob = (newJob: JobItem) => {
    setJobs(prev => [newJob, ...prev]);
    showToast(`Đã thêm: "${newJob.title}"`);
  };

  const handleUpdateNotes = (jobId: string, notes: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ssNotes: notes } : j));
    if (selectedJobDetail?.id === jobId) setSelectedJobDetail(prev => prev ? { ...prev, ssNotes: notes } : null);
    showToast('Đã lưu ghi chú!');
  };

  const handleUpdateStatus = (jobId: string, status: JobStatusType) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
    if (selectedJobDetail?.id === jobId) setSelectedJobDetail(prev => prev ? { ...prev, status } : null);
    showToast(`Trạng thái: "${status}"`);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    setSelectedJobDetail(null);
    showToast('Đã xóa bài tuyển dụng!');
  };

  const handleMergeJobs = (_pairId: string, keepJob: JobItem) => showToast(`Đã gộp: "${keepJob.title}"`);

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

  // Tính active filters để hiển thị pills
  const activeFilterCount = [
    filters.industries, filters.levels, filters.locations,
    filters.employmentTypes, filters.sources, filters.statuses,
    filters.fitScores, filters.selectedSkills
  ].reduce((acc, arr) => acc + arr.length, 0) + (filters.searchKeyword ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Toast */}
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

      <main className="flex-1">

        {/* ── TAB 1: JOB HUB ── */}
        {activeTab === 'jobhub' && (
          <div>
            {/* Slim hero strip */}
            <div className="bg-white border-b border-slate-100">
              <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-slate-800">Danh sách tuyển dụng</span>
                  <span className="ml-2 text-xs text-slate-400">Intern · Fresher · Junior – đã kiểm duyệt bởi Team SS</span>
                </div>
                <span className="text-xs text-slate-400">
                  Tổng DB: <strong className="text-indigo-600">{TOTAL_DB_METRICS.totalJobsInDb}</strong> jobs · Tuần này mới: <strong className="text-emerald-600">+{TOTAL_DB_METRICS.newJobsThisWeek}</strong>
                </span>
              </div>
            </div>

            {/* Filter bar */}
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              onResetFilters={() => setFilters(INITIAL_FILTER_STATE)}
              popularSkills={popularSkills}
              resultCount={filteredJobs.length}
            />

            {/* View controls */}
            <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-800">{filteredJobs.length}</span> kết quả
                {activeFilterCount > 0 && (
                  <span className="text-indigo-600">· {activeFilterCount} bộ lọc đang bật</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 p-0.5 rounded-xl gap-0.5">
                  {[
                    { mode: 'grid', Icon: LayoutGrid, label: 'Card' },
                    { mode: 'table', Icon: Table, label: 'Bảng' },
                    { mode: 'student', Icon: GraduationCap, label: 'Portal' }
                  ].map(({ mode, Icon, label }) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode as typeof viewMode)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg font-medium transition-all ${
                        viewMode === mode ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => exportJobsToCSV(filteredJobs)} className="btn-ghost text-xs">
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Xuất Excel</span>
                </button>
              </div>
            </div>

            {/* Job list */}
            <div className="max-w-screen-xl mx-auto px-6 pb-10">
              {filteredJobs.length === 0 ? (
                <div className="card p-12 text-center space-y-3">
                  <p className="font-bold text-slate-800">Không tìm thấy kết quả nào</p>
                  <p className="text-sm text-slate-500">Thử xóa bộ lọc hoặc thay đổi từ khóa.</p>
                  <button type="button" onClick={() => setFilters(INITIAL_FILTER_STATE)} className="btn-secondary text-xs mx-auto">
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredJobs.map(job => (
                    <JobCard key={job.id} job={job} onSelectJob={setSelectedJobDetail} onMatchStudent={setMatchingJob} />
                  ))}
                </div>
              ) : viewMode === 'table' ? (
                <JobTableView jobs={filteredJobs} onSelectJob={setSelectedJobDetail} onMatchStudent={setMatchingJob} onDeleteJob={handleDeleteJob} />
              ) : (
                <StudentPortalView jobs={filteredJobs} onSelectJob={setSelectedJobDetail} />
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: ANALYTICS ── */}
        {activeTab === 'analytics' && (
          <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Báo cáo thị trường Job</h1>
              <p className="text-sm text-slate-500 mt-0.5">Phân tích xu hướng tuyển dụng Intern/Fresher.</p>
            </div>
            <StatCards />
            <AnalyticsCharts />
          </div>
        )}

        {/* ── TAB 3: TOOLS ── */}
        {activeTab === 'tools' && (
          <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Công cụ Quản trị</h1>
              <p className="text-sm text-slate-500 mt-0.5">Cào job tự động, phát hiện trùng lặp, Import/Export.</p>
            </div>
            <ScraperController />
            <DeduplicationTool jobs={jobs} onMergeJobs={handleMergeJobs} onDeleteDuplicate={handleDeleteDuplicate} />
            <ImportExport jobs={jobs} onImportJobs={handleImportJobs} />
          </div>
        )}

        {/* ── TAB 4: SMART ── */}
        {activeTab === 'smart' && (
          <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Bản tin & Match Học viên</h1>
              <p className="text-sm text-slate-500 mt-0.5">Tạo newsletter và gợi ý học viên phù hợp.</p>
            </div>
            <NewsletterGenerator jobs={jobs} />
          </div>
        )}

      </main>

      <footer className="border-t border-slate-100 bg-white py-4 text-center text-xs text-slate-400">
        © 2026 MindX Technology Education · SS Hub v2.4 · Hệ thống nội bộ
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
      <AddJobModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddJob={handleAddJob} />
      <StudentMatchModal job={matchingJob} students={INITIAL_MOCK_STUDENTS} onClose={() => setMatchingJob(null)} onSendJobToStudent={handleSendJobToStudent} />
      <SystemDocsModal isOpen={isDocsModalOpen} onClose={() => setIsDocsModalOpen(false)} />
    </div>
  );
}
