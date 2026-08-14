import { useState, useEffect, useCallback, useRef } from 'react';
import { JobItem, FilterState } from '../types/job';
import { getJobs } from '../services/jobService';
import { INITIAL_MOCK_JOBS } from '../data/mockJobs';

interface UseJobsReturn {
  jobs: JobItem[];
  loading: boolean;
  error: string | null;
  total: number;
  usingMock: boolean;
  refetch: () => void;
  addJobLocally: (job: JobItem) => void;
  updateJobLocally: (id: string, patch: Partial<JobItem>) => void;
  removeJobLocally: (id: string) => void;
}

// Map FilterState (frontend) → query params (backend)
function filtersToParams(filters: FilterState) {
  return {
    keyword:        filters.searchKeyword || undefined,
    industry:       filters.industries.length    ? filters.industries.join(',')    : undefined,
    level:          filters.levels.length        ? filters.levels.join(',')        : undefined,
    location:       filters.locations.length     ? filters.locations.join(',')     : undefined,
    source:         filters.sources.length       ? filters.sources.join(',')       : undefined,
    status:         filters.statuses.length      ? filters.statuses.join(',')      : undefined,
    fitScore:       filters.fitScores.length     ? filters.fitScores.join(',')     : undefined,
    employmentType: filters.employmentTypes.length ? filters.employmentTypes.join(',') : undefined,
    skills:         filters.selectedSkills.length ? filters.selectedSkills.join(',') : undefined,
    // Salary range: "3-15" → salaryMin=3, salaryMax=15
    salaryMin: filters.salaryRange ? Number(filters.salaryRange.split('-')[0]) || undefined : undefined,
    salaryMax: filters.salaryRange ? Number(filters.salaryRange.split('-')[1]) || undefined : undefined,
    limit: 500, // DB có 484 jobs, load hết một lần
  };
}

export function useJobs(filters: FilterState): UseJobsReturn {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [usingMock, setUsingMock] = useState(false);
  const fetchCountRef = useRef(0);

  const fetchJobs = useCallback(async () => {
    const currentFetch = ++fetchCountRef.current;
    setLoading(true);
    setError(null);

    try {
      const params = filtersToParams(filters);
      const res = await getJobs(params);

      // Ignore stale responses
      if (currentFetch !== fetchCountRef.current) return;

      // Map _id → id (MongoDB uses _id)
      const mapped: JobItem[] = res.data.map((j: any) => ({
        ...j,
        id: j._id || j.id,
      }));

      setJobs(mapped);
      setTotal(res.pagination.total);
      setUsingMock(false);
    } catch (err) {
      if (currentFetch !== fetchCountRef.current) return;

      console.warn('[useJobs] Backend unavailable, falling back to mock data');
      // Fallback: filter mock data client-side
      const filtered = applyClientFilter(INITIAL_MOCK_JOBS, filters);
      setJobs(filtered);
      setTotal(filtered.length);
      setUsingMock(true);
      setError('Backend chưa kết nối — đang dùng mock data');
    } finally {
      if (currentFetch === fetchCountRef.current) setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Local optimistic updates (không cần refetch)
  const addJobLocally    = (job: JobItem)                         => setJobs(p => [job, ...p]);
  const updateJobLocally = (id: string, patch: Partial<JobItem>) => setJobs(p => p.map(j => j.id === id ? { ...j, ...patch } : j));
  const removeJobLocally = (id: string)                          => setJobs(p => p.filter(j => j.id !== id));

  return { jobs, loading, error, total, usingMock, refetch: fetchJobs, addJobLocally, updateJobLocally, removeJobLocally };
}

// Client-side filter fallback (when backend is offline)
function applyClientFilter(jobs: JobItem[], filters: FilterState): JobItem[] {
  return jobs.filter(j => {
    if (filters.searchKeyword) {
      const kw = filters.searchKeyword.toLowerCase();
      if (!j.title.toLowerCase().includes(kw) && !j.companyName.toLowerCase().includes(kw) && !j.skills.some(s => s.toLowerCase().includes(kw))) return false;
    }
    if (filters.industries.length    && !filters.industries.includes(j.industry))        return false;
    if (filters.levels.length        && !filters.levels.includes(j.level))               return false;
    if (filters.locations.length     && !filters.locations.includes(j.location))         return false;
    if (filters.employmentTypes.length && !filters.employmentTypes.includes(j.employmentType)) return false;
    if (filters.sources.length       && !filters.sources.includes(j.source))             return false;
    if (filters.statuses.length      && !filters.statuses.includes(j.status))            return false;
    if (filters.fitScores.length     && !filters.fitScores.includes(j.mindxFitScore))    return false;
    if (filters.selectedSkills.length && !filters.selectedSkills.some(sk => j.skills.includes(sk))) return false;
    return true;
  });
}
