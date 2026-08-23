import { useState, useEffect } from 'react';
import { getAnalyticsSummary } from '../services/jobService';

export interface AnalyticsSummary {
  total: number;
  newThisWeek: number;
  byIndustry: { _id: string; count: number }[];
  byLocation: { _id: string; count: number }[];
  byLevel:    { _id: string; count: number }[];
  bySource:   { _id: string; count: number }[];
  byStatus:   { _id: string; count: number }[];
  byFit:      { _id: string; count: number }[];
  topSkills:  { _id: string; count: number }[];
  byWeek:     { week: string; count: number }[];
}

interface UseAnalyticsReturn {
  data: AnalyticsSummary | null;
  loading: boolean;
  error: string | null;
}

// Helper: find count for a given _id key
export function getCount(arr: { _id: string; count: number }[], key: string): number {
  return arr.find(x => x._id === key)?.count ?? 0;
}

export function useAnalytics(): UseAnalyticsReturn {
  const [data, setData]       = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getAnalyticsSummary()
      .then(d => { if (!cancelled) { setData(d); setError(null); } })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
