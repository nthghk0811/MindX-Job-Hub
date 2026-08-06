import React from 'react';
import { Filter, Search, RotateCcw, Check, Sparkles } from 'lucide-react';
import { FilterState, IndustryType, LevelType, LocationType, EmploymentType, SourceType, JobStatusType, FitScoreType } from '../../types/job';

interface SidebarFilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onResetFilters: () => void;
  popularSkills: string[];
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  filters,
  setFilters,
  onResetFilters,
  popularSkills
}) => {

  const toggleArrayFilter = <T extends string>(field: keyof FilterState, value: T) => {
    setFilters(prev => {
      const arr = (prev[field] as T[]) || [];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const toggleSkillFilter = (skill: string) => {
    setFilters(prev => {
      const selected = prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill];
      return { ...prev, selectedSkills: selected };
    });
  };

  return (
    <aside className="w-full lg:w-80 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6 shrink-0 h-fit">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-white font-semibold">
          <Filter className="w-4 h-4 text-rose-500" />
          <span>Bộ Lọc Job Thông Minh</span>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-rose-400 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Keyword Search */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Từ khóa tìm kiếm</label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Vị trí, Kỹ năng, Công ty..."
            value={filters.searchKeyword}
            onChange={(e) => setFilters(prev => ({ ...prev, searchKeyword: e.target.value }))}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
      </div>

      {/* Industry Checkboxes */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Ngành Phù Hợp</label>
        <div className="space-y-1.5">
          {(['Code', 'Data Analysis', 'Business Analysis'] as IndustryType[]).map(ind => (
            <label key={ind} className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={filters.industries.includes(ind)}
                onChange={() => toggleArrayFilter('industries', ind)}
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-rose-600 focus:ring-rose-500 focus:ring-offset-slate-900"
              />
              <span>{ind}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Level Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Level (Trình độ)</label>
        <div className="flex flex-wrap gap-1.5">
          {(['Intern', 'Fresher', 'Junior'] as LevelType[]).map(lvl => {
            const isSelected = filters.levels.includes(lvl);
            return (
              <button
                key={lvl}
                onClick={() => toggleArrayFilter('levels', lvl)}
                className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Địa Điểm Làm Việc</label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['Hà Nội', 'TP.HCM', 'Remote', 'Hybrid'] as LocationType[]).map(loc => {
            const isSelected = filters.locations.includes(loc);
            return (
              <button
                key={loc}
                onClick={() => toggleArrayFilter('locations', loc)}
                className={`px-2.5 py-1 text-xs text-center rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>

      {/* Source Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Nguồn Thu Thập</label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['TopCV', 'ITviec', 'LinkedIn', 'VietnamWorks', 'Ybox', 'Facebook Group'] as SourceType[]).map(src => {
            const isSelected = filters.sources.includes(src);
            return (
              <button
                key={src}
                onClick={() => toggleArrayFilter('sources', src)}
                className={`px-2 py-1 text-xs text-center rounded-lg border truncate transition-all ${
                  isSelected
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {src}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Trạng Thái Job</label>
        <div className="space-y-1">
          {(['Còn tuyển', 'Hết hạn', 'Chưa xác minh', 'Đã gửi học viên'] as JobStatusType[]).map(st => (
            <label key={st} className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={filters.statuses.includes(st)}
                onChange={() => toggleArrayFilter('statuses', st)}
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-rose-600 focus:ring-rose-500 focus:ring-offset-slate-900"
              />
              <span>{st}</span>
            </label>
          ))}
        </div>
      </div>

      {/* MindX Fit Score */}
      <div className="space-y-2">
        <div className="flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Độ Phù Hợp MindX</label>
        </div>
        <div className="flex space-x-2">
          {(['High', 'Medium', 'Low'] as FitScoreType[]).map(fit => {
            const isSelected = filters.fitScores.includes(fit);
            return (
              <button
                key={fit}
                onClick={() => toggleArrayFilter('fitScores', fit)}
                className={`flex-1 py-1 text-xs font-bold rounded-lg border transition-all ${
                  isSelected
                    ? fit === 'High' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : fit === 'Medium' ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-rose-500/20 border-rose-500 text-rose-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {fit}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clickable Skill Tag Cloud */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Popular Skills</label>
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
          {popularSkills.map(skill => {
            const isSelected = filters.selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkillFilter(skill)}
                className={`px-2 py-0.5 text-xs rounded-full border transition-all ${
                  isSelected
                    ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                #{skill}
              </button>
            );
          })}
        </div>
      </div>

    </aside>
  );
};
