import api from './api';
import { JobItem, JobStatusType } from '../types/job';

interface JobsResponse {
  success: boolean;
  data: JobItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface JobResponse {
  success: boolean;
  data: JobItem;
}

export interface JobFilters {
  keyword?: string;
  industry?: string;   // comma-separated
  level?: string;
  location?: string;
  source?: string;
  status?: string;
  fitScore?: string;
  employmentType?: string;
  skills?: string;
  salaryMin?: number;
  salaryMax?: number;
  deadlineBefore?: string;
  page?: number;
  limit?: number;
}

// ── GET danh sách jobs ────────────────────────────────
export async function getJobs(filters: JobFilters = {}): Promise<JobsResponse> {
  // Build query params (bỏ các field rỗng)
  const params: Record<string, string | number> = {};
  if (filters.keyword)        params.keyword        = filters.keyword;
  if (filters.industry)       params.industry       = filters.industry;
  if (filters.level)          params.level          = filters.level;
  if (filters.location)       params.location       = filters.location;
  if (filters.source)         params.source         = filters.source;
  if (filters.status)         params.status         = filters.status;
  if (filters.fitScore)       params.fitScore       = filters.fitScore;
  if (filters.employmentType) params.employmentType = filters.employmentType;
  if (filters.skills)         params.skills         = filters.skills;
  if (filters.salaryMin)      params.salaryMin      = filters.salaryMin;
  if (filters.salaryMax)      params.salaryMax      = filters.salaryMax;
  if (filters.deadlineBefore) params.deadlineBefore = filters.deadlineBefore;
  params.page  = filters.page  || 1;
  params.limit = filters.limit || 50;

  const res = await api.get<JobsResponse>('/jobs', { params });
  return res.data;
}

// ── GET chi tiết 1 job ───────────────────────────────
export async function getJobById(id: string): Promise<JobItem> {
  const res = await api.get<JobResponse>(`/jobs/${id}`);
  return res.data.data;
}

// ── POST tạo job mới ─────────────────────────────────
export async function createJob(jobData: Partial<JobItem>): Promise<JobItem> {
  const res = await api.post<JobResponse>('/jobs', jobData);
  return res.data.data;
}

// ── PUT cập nhật toàn bộ job ─────────────────────────
export async function updateJob(id: string, jobData: Partial<JobItem>): Promise<JobItem> {
  const res = await api.put<JobResponse>(`/jobs/${id}`, jobData);
  return res.data.data;
}

// ── PATCH cập nhật status ────────────────────────────
export async function updateJobStatus(id: string, status: JobStatusType): Promise<JobItem> {
  const res = await api.patch<JobResponse>(`/jobs/${id}/status`, { status });
  return res.data.data;
}

// ── PATCH cập nhật ghi chú SS ───────────────────────
export async function updateJobNotes(id: string, ssNotes: string): Promise<JobItem> {
  const res = await api.patch<JobResponse>(`/jobs/${id}/notes`, { ssNotes });
  return res.data.data;
}

// ── DELETE xóa job ───────────────────────────────────
export async function deleteJob(id: string): Promise<void> {
  await api.delete(`/jobs/${id}`);
}

// ── GET duplicates ───────────────────────────────────
export async function getDuplicates() {
  const res = await api.get('/jobs/duplicates');
  return res.data.data;
}

// ── POST import file ─────────────────────────────────
export async function importJobsFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/jobs/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// ── GET analytics summary ────────────────────────────
export async function getAnalyticsSummary() {
  const res = await api.get('/analytics/summary');
  return res.data.data;
}
