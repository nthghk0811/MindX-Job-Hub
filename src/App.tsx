import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { FilterBar } from './components/layout/FilterBar';
import { JobCard } from './components/jobhub/JobCard';
import { JobTableView } from './components/jobhub/JobTableView';
import { StudentPortalView } from './components/jobhub/StudentPortalView';
import { JobDetailModal } from './components/jobhub/JobDetailModal';
import { AddJobModal } from './components/jobhub/AddJobModal';
import { AddStudentModal } from './components/jobhub/AddStudentModal';
import { StudentMatchModal } from './components/jobhub/StudentMatchModal';
import { StatCards } from './components/analytics/StatCards';
import { AnalyticsCharts } from './components/analytics/AnalyticsCharts';
import { ImportExport } from './components/tools/ImportExport';
import { DeduplicationTool } from './components/tools/DeduplicationTool';
import { Pagination } from './components/common/Pagination';
import { LoginScreen } from './components/auth/LoginScreen';

import { INITIAL_MOCK_STUDENTS } from './data/mockStudents'; // fallback only
import { JobItem, FilterState, JobStatusType, MindXStudent } from './types/job';
import { exportJobsToCSV } from './utils/exportUtils';
import { useJobs } from './hooks/useJobs';
import { createJob, updateJobStatus, updateJobNotes, deleteJob } from './services/jobService';
import { getStudents, createStudent, bulkCreateStudents } from './services/studentService';
import { LayoutGrid, Table, GraduationCap, Download, CheckCircle, AlertTriangle } from 'lucide-react';

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

import { authService, AuthUser } from './services/authService';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return authService.getUser();
  });

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [activeTab, setActiveTab] = useState<'jobhub' | 'analytics' | 'tools'>('jobhub');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'student'>('grid');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  // Modals & Details State
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobItem | null>(null);
  const [matchingJob, setMatchingJob] = useState<JobItem | null>(null);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Students State — starts empty, loaded from API
  const [students, setStudents] = useState<MindXStudent[]>([]);

  // ── API-backed jobs state ─────────────────────────────
  const { jobs, loading, total, usingMock, refetch, addJobLocally, updateJobLocally, removeJobLocally } = useJobs(filters);

  // Fetch live students from backend on mount
  useEffect(() => {
    getStudents()
      .then((data) => {
        if (data && data.length > 0) setStudents(data);
        else setStudents(INITIAL_MOCK_STUDENTS); // fallback to mock if DB is empty
      })
      .catch(() => {
        setStudents(INITIAL_MOCK_STUDENTS); // fallback if backend unavailable
      });
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const popularSkills = useMemo(() => {
    const skillCounts: Record<string, number> = {};
    jobs.forEach(j => { j.skills.forEach(s => { skillCounts[s] = (skillCounts[s] || 0) + 1; }); });
    return Object.keys(skillCounts).sort((a, b) => skillCounts[b] - skillCounts[a]);
  }, [jobs]);

  const filteredJobs = jobs;

  // ── Pagination Calculation ────────────────────────────
  const totalPages = Math.ceil(filteredJobs.length / pageSize) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, currentPage, pageSize]);

  // ── Job Handlers ──────────────────────────────────────
  const handleAddJob = async (newJob: JobItem) => {
    try {
      if (!usingMock) {
        const created = await createJob(newJob as any);
        addJobLocally({ ...created, id: (created as any)._id || created.id });
      } else {
        addJobLocally(newJob);
      }
      showToast(`Đã thêm bài tuyển dụng: "${newJob.title}"`);
    } catch {
      addJobLocally(newJob);
      showToast(`Đã thêm: "${newJob.title}" (offline)`);
    }
  };

  const handleUpdateNotes = async (jobId: string, notes: string) => {
    updateJobLocally(jobId, { ssNotes: notes });
    if (selectedJobDetail?.id === jobId) setSelectedJobDetail(prev => prev ? { ...prev, ssNotes: notes } : null);
    try {
      if (!usingMock) await updateJobNotes(jobId, notes);
      showToast('Đã lưu ghi chú!');
    } catch { showToast('Đã lưu ghi chú (offline)!'); }
  };

  const handleUpdateStatus = async (jobId: string, status: JobStatusType) => {
    updateJobLocally(jobId, { status });
    if (selectedJobDetail?.id === jobId) setSelectedJobDetail(prev => prev ? { ...prev, status } : null);
    try {
      if (!usingMock) await updateJobStatus(jobId, status);
      showToast(`Trạng thái: "${status}"`);
    } catch { showToast(`Trạng thái: "${status}" (offline)`); }
  };

  const handleDeleteJob = async (jobId: string) => {
    removeJobLocally(jobId);
    setSelectedJobDetail(null);
    try {
      if (!usingMock) await deleteJob(jobId);
      showToast('Đã xóa bài tuyển dụng!');
    } catch { showToast('Đã xóa (offline)!'); }
  };

  const handleMergeJobs = (_pairId: string, keepJob: JobItem) => showToast(`Đã gộp: "${keepJob.title}"`);

  const handleDeleteDuplicate = (_pairId: string, removeJobId: string) => {
    removeJobLocally(removeJobId);
    showToast('Đã xóa bản ghi trùng lặp!');
  };

  const handleImportJobs = (imported: JobItem[]) => {
    imported.forEach(j => addJobLocally(j));
    showToast(`Import thành công ${imported.length} jobs!`);
    refetch();
  };

  // ── Student Handlers ──────────────────────────────────
  const handleAddStudent = async (studentData: Omit<MindXStudent, 'id'>) => {
    try {
      const created = await createStudent(studentData);
      setStudents(prev => [created, ...prev]);
      showToast(`Đã thêm học viên: ${studentData.fullName}`);
    } catch {
      const fallback: MindXStudent = { ...studentData, id: `std-${Date.now()}` };
      setStudents(prev => [fallback, ...prev]);
      showToast(`Đã thêm học viên: ${studentData.fullName}`);
    }
  };

  const handleBulkAddStudents = async (studentList: Omit<MindXStudent, 'id'>[]) => {
    try {
      const createdList = await bulkCreateStudents(studentList);
      setStudents(prev => [...createdList, ...prev]);
      showToast(`Đã import thành công ${studentList.length} học viên!`);
    } catch {
      const fallbackList: MindXStudent[] = studentList.map((s, idx) => ({
        ...s,
        id: `std-${Date.now()}-${idx}`
      }));
      setStudents(prev => [...fallbackList, ...prev]);
      showToast(`Đã import thành công ${studentList.length} học viên!`);
    }
  };

  const handleSendJobToStudent = (studentName: string, jobTitle: string) => {
    showToast(`Đã gợi ý "${jobTitle}" cho học viên ${studentName}!`);
  };

  const activeFilterCount = [
    filters.industries, filters.levels, filters.locations,
    filters.employmentTypes, filters.sources, filters.statuses,
    filters.fitScores, filters.selectedSkills
  ].reduce((acc, arr) => acc + arr.length, 0) + (filters.searchKeyword ? 1 : 0);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    showToast(`Chào mừng ${user.name || user.username} đến với MindX Job Hub!`);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    showToast('Đã đăng xuất thành công.');
  };

  // If not logged in, show Login Screen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-success">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mock-mode warning banner */}
      {usingMock && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center gap-2 text-amber-700 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Backend chưa kết nối — đang hiển thị <strong>mock data</strong>. Chạy <code className="font-mono bg-amber-100 px-1 rounded">npm run dev</code> trong thư mục <code className="font-mono bg-amber-100 px-1 rounded">backend/</code> để kết nối MongoDB Atlas.</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddJobModal={() => setIsAddJobModalOpen(true)}
        onOpenAddStudentModal={() => setIsAddStudentModalOpen(true)}
        totalJobsCount={usingMock ? jobs.length : total}
        currentUser={currentUser.name || currentUser.username}
        onLogout={handleLogout}
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
                  Tổng DB: <strong className="text-indigo-600 font-semibold">{usingMock ? jobs.length : total}</strong> jobs
                  {usingMock && <span className="text-amber-500 ml-1">(mock)</span>}
                </span>
              </div>
            </div>

            {/* Filter bar */}
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              onResetFilters={() => setFilters(INITIAL_FILTER_STATE)}
              popularSkills={popularSkills}
              resultCount={usingMock ? filteredJobs.length : total}
            />

            {/* View controls & Summary */}
            <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-800">{filteredJobs.length}</span> kết quả phù hợp
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

            {/* Job list & Pagination */}
            <div className="max-w-screen-xl mx-auto px-6 pb-10">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 animate-pulse">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-slate-100 rounded w-3/4" />
                          <div className="h-2 bg-slate-100 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="h-4 bg-slate-100 rounded w-5/6" />
                      <div className="h-3 bg-slate-100 rounded w-2/3" />
                      <div className="flex gap-1.5">
                        {[1,2,3].map(k => <div key={k} className="h-5 w-14 bg-slate-100 rounded" />)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="card p-12 text-center space-y-3">
                  <p className="font-bold text-slate-800">Không tìm thấy bài tuyển dụng nào phù hợp</p>
                  <p className="text-sm text-slate-500">Thử xóa bớt bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
                  <button type="button" onClick={() => setFilters(INITIAL_FILTER_STATE)} className="btn-secondary text-xs mx-auto">
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              ) : (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {paginatedJobs.map(job => (
                        <JobCard key={job.id} job={job} onSelectJob={setSelectedJobDetail} onMatchStudent={setMatchingJob} />
                      ))}
                    </div>
                  ) : viewMode === 'table' ? (
                    <JobTableView jobs={paginatedJobs} onSelectJob={setSelectedJobDetail} onMatchStudent={setMatchingJob} onDeleteJob={handleDeleteJob} />
                  ) : (
                    <StudentPortalView jobs={paginatedJobs} onSelectJob={setSelectedJobDetail} />
                  )}

                  {/* Clean, intuitive Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredJobs.length}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: ANALYTICS ── */}
        {activeTab === 'analytics' && (
          <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Báo cáo thị trường Job</h1>
              <p className="text-sm text-slate-500 mt-0.5">Phân tích xu hướng tuyển dụng Intern/Fresher theo dữ liệu thực tế từ Database.</p>
            </div>
            <StatCards />
            <AnalyticsCharts />
          </div>
        )}

        {/* ── TAB 3: TOOLS ── */}
        {activeTab === 'tools' && (
          <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Quản lý Dữ liệu & Trùng lặp</h1>
              <p className="text-sm text-slate-500 mt-0.5">Phát hiện & loại bỏ bài tuyển dụng trùng lặp trên Database, Import & Export file Excel/CSV.</p>
            </div>
            <DeduplicationTool jobs={jobs} onMergeJobs={handleMergeJobs} onDeleteDuplicate={handleDeleteDuplicate} />
            <ImportExport jobs={jobs} onImportJobs={handleImportJobs} />
          </div>
        )}

      </main>

      <footer className="border-t border-slate-100 bg-white py-4 text-center text-xs text-slate-400">
        © 2026 MindX Technology School · Student Success System · Hệ thống nội bộ
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
      <AddJobModal isOpen={isAddJobModalOpen} onClose={() => setIsAddJobModalOpen(false)} onAddJob={handleAddJob} />
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        onAddStudent={handleAddStudent}
        onBulkAddStudents={handleBulkAddStudents}
      />
      <StudentMatchModal
        job={matchingJob}
        students={students}
        onClose={() => setMatchingJob(null)}
        onSendJobToStudent={handleSendJobToStudent}
      />
    </div>
  );
}
