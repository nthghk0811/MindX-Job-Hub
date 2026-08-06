import React from 'react';
import { Filter, Search, RotateCcw } from 'lucide-react';
import { FilterState, IndustryType, LevelType, LocationType, SourceType, JobStatusType, FitScoreType } from '../../types/job';

interface SidebarFilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onResetFilters: () => void;
  popularSkills: string[];
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
      />
      {label}
    </label>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5 pb-4 border-b border-slate-100 last:border-0">
      <p className="filter-label">{title}</p>
      {children}
    </div>
  );
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  filters,
  setFilters,
  onResetFilters,
  popularSkills
}) => {
  const toggle = <T extends string>(field: keyof FilterState, value: T) => {
    setFilters(prev => {
      const arr = (prev[field] as T[]);
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value]
      };
    });
  };

  const toggleSkill = (skill: string) =>
    setFilters(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill]
    }));

  const hasFilters =
    filters.searchKeyword ||
    filters.industries.length || filters.levels.length ||
    filters.locations.length || filters.sources.length ||
    filters.statuses.length || filters.fitScores.length ||
    filters.selectedSkills.length;

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-0 card p-4 h-fit">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
          <Filter className="w-4 h-4 text-indigo-600" />
          Bộ lọc
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Xóa lọc
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <FilterSection title="Tìm kiếm">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Vị trí, kỹ năng, công ty..."
              value={filters.searchKeyword}
              onChange={e => setFilters(prev => ({ ...prev, searchKeyword: e.target.value }))}
              className="input pl-8 text-xs"
            />
          </div>
        </FilterSection>

        {/* Industry */}
        <FilterSection title="Ngành nghề">
          {(['Code', 'Data Analysis', 'Business Analysis'] as IndustryType[]).map(v => (
            <Checkbox key={v} label={v} checked={filters.industries.includes(v)} onChange={() => toggle('industries', v)} />
          ))}
        </FilterSection>

        {/* Level */}
        <FilterSection title="Cấp độ">
          {(['Intern', 'Fresher', 'Junior'] as LevelType[]).map(v => (
            <Checkbox key={v} label={v} checked={filters.levels.includes(v)} onChange={() => toggle('levels', v)} />
          ))}
        </FilterSection>

        {/* Location */}
        <FilterSection title="Địa điểm">
          <div className="grid grid-cols-2 gap-1.5">
            {(['Hà Nội', 'TP.HCM', 'Remote', 'Hybrid'] as LocationType[]).map(v => {
              const active = filters.locations.includes(v);
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => toggle('locations', v)}
                  className={`text-xs py-1.5 rounded-lg border transition-all font-medium ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Source */}
        <FilterSection title="Nguồn">
          {(['TopCV', 'ITviec', 'LinkedIn', 'VietnamWorks', 'Ybox', 'Facebook Group'] as SourceType[]).map(v => (
            <Checkbox key={v} label={v} checked={filters.sources.includes(v)} onChange={() => toggle('sources', v)} />
          ))}
        </FilterSection>

        {/* Status */}
        <FilterSection title="Trạng thái">
          {(['Còn tuyển', 'Hết hạn', 'Chưa xác minh', 'Đã gửi học viên'] as JobStatusType[]).map(v => (
            <Checkbox key={v} label={v} checked={filters.statuses.includes(v)} onChange={() => toggle('statuses', v)} />
          ))}
        </FilterSection>

        {/* MindX Fit Score */}
        <FilterSection title="Độ phù hợp MindX">
          <div className="flex gap-2">
            {(['High', 'Medium', 'Low'] as FitScoreType[]).map(v => {
              const active = filters.fitScores.includes(v);
              const colorMap: Record<FitScoreType, string> = {
                High:   active ? 'bg-emerald-600 text-white border-emerald-600' : 'text-emerald-700 border-emerald-200 hover:border-emerald-400',
                Medium: active ? 'bg-amber-500 text-white border-amber-500'    : 'text-amber-700 border-amber-200 hover:border-amber-400',
                Low:    active ? 'bg-rose-500 text-white border-rose-500'      : 'text-rose-700 border-rose-200 hover:border-rose-400',
              };
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => toggle('fitScores', v)}
                  className={`flex-1 text-xs py-1.5 rounded-lg border font-bold transition-all ${colorMap[v]}`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Skills tag cloud */}
        <div className="space-y-2.5">
          <p className="filter-label">Kỹ năng phổ biến</p>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {popularSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={filters.selectedSkills.includes(skill) ? 'skill-pill-active' : 'skill-pill'}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
