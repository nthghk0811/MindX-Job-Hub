export type IndustryType = 'Code' | 'Data Analysis' | 'Business Analysis';
export type LevelType = 'Intern' | 'Fresher' | 'Junior';
export type LocationType = 'Hà Nội' | 'TP.HCM' | 'Remote' | 'Hybrid';
export type EmploymentType = 'Fulltime' | 'Parttime' | 'Internship' | 'Trainee';
export type SourceType = 'TopCV' | 'ITviec' | 'LinkedIn' | 'VietnamWorks' | 'Ybox' | 'Facebook Group';
export type JobStatusType = 'Còn tuyển' | 'Hết hạn' | 'Chưa xác minh' | 'Đã gửi học viên';
export type FitScoreType = 'High' | 'Medium' | 'Low';

export interface JobItem {
  id: string;
  companyName: string;
  companyLogo?: string;
  website: string;
  title: string;
  industry: IndustryType;
  level: LevelType;
  location: LocationType;
  employmentType: EmploymentType;
  description: string;
  requirements: string;
  skills: string[];
  salary: string;
  benefits: string;
  deadline: string;
  originalUrl: string;
  source: SourceType;
  scrapedAt: string;
  status: JobStatusType;
  mindxFitScore: FitScoreType;
  ssNotes: string;
}

export interface FilterState {
  searchKeyword: string;
  industries: IndustryType[];
  levels: LevelType[];
  locations: LocationType[];
  employmentTypes: EmploymentType[];
  salaryRange: string;
  sources: SourceType[];
  statuses: JobStatusType[];
  fitScores: FitScoreType[];
  selectedSkills: string[];
}

export interface MindXStudent {
  id: string;
  fullName: string;
  course: string; // e.g. "Fullstack Web K72", "Data Science K18"
  industry: IndustryType;
  skills: string[];
  preferredLocation: LocationType;
  expectedSalary: string;
  cvLink: string;
  matchScore?: number;
}

export interface ScraperStatus {
  id: string;
  name: SourceType;
  url: string;
  lastScraped: string;
  totalJobsScraped: number;
  status: 'Idle' | 'Running' | 'Success' | 'Error';
  color: string;
}

export interface DedupPair {
  id: string;
  jobA: JobItem;
  jobB: JobItem;
  similarityReason: string;
  confidence: number; // Percentage, e.g. 92
}
