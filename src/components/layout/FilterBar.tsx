import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { FilterState, IndustryType, LevelType, LocationType, SourceType, JobStatusType, FitScoreType, EmploymentType } from '../../types/job';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onResetFilters: () => void;
  popularSkills: string[];
  resultCount: number;
}

// ── Dropdown options ──
const INDUSTRIES: IndustryType[] = ['Code', 'Data Analysis', 'Business Analysis'];
const LEVELS: LevelType[] = ['Intern', 'Fresher', 'Junior'];
const LOCATIONS: LocationType[] = ['Hà Nội', 'TP.HCM', 'Remote', 'Hybrid'];
const SOURCES: SourceType[] = ['JobsGo', 'NEU', 'TopCV', 'ITviec', 'LinkedIn', 'VietnamWorks', 'Ybox', 'Facebook Group', 'Manual'];
const STATUSES: JobStatusType[] = ['Còn tuyển', 'Hết hạn', 'Chưa xác minh', 'Đã gửi học viên'];
const FIT_SCORES: FitScoreType[] = ['High', 'Medium', 'Low'];
const EMP_TYPES: EmploymentType[] = ['Internship', 'Fulltime', 'Parttime', 'Trainee'];

type DropdownKey = 'industry' | 'level' | 'location' | 'source' | 'status' | 'advanced' | null;

interface DropdownProps {
  label: string;
  active: boolean;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Dropdown({ label, active, isOpen, onToggle, children }: DropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap ${
          active
            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600'
        }`}
      >
        {label}
        <span className={`text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 min-w-[160px] p-2 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg text-left transition-colors ${
        checked ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors ${
        checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
      }`}>
        {checked && <span className="text-white text-[8px] font-bold">✓</span>}
      </span>
      {label}
    </button>
  );
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, onResetFilters, popularSkills, resultCount }) => {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggle = (key: DropdownKey) => setOpenDropdown(prev => prev === key ? null : key);

  const toggleArray = <T extends string>(field: keyof FilterState, value: T) => {
    setFilters(prev => {
      const arr = prev[field] as T[];
      return { ...prev, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  // Active filter labels for pills
  const activePills: { label: string; onRemove: () => void }[] = [
    ...filters.industries.map(v => ({ label: v, onRemove: () => toggleArray('industries', v) })),
    ...filters.levels.map(v => ({ label: v, onRemove: () => toggleArray('levels', v) })),
    ...filters.locations.map(v => ({ label: v, onRemove: () => toggleArray('locations', v) })),
    ...filters.sources.map(v => ({ label: v, onRemove: () => toggleArray('sources', v) })),
    ...filters.statuses.map(v => ({ label: v, onRemove: () => toggleArray('statuses', v) })),
    ...filters.fitScores.map(v => ({ label: `Fit: ${v}`, onRemove: () => toggleArray('fitScores', v) })),
    ...filters.employmentTypes.map(v => ({ label: v, onRemove: () => toggleArray('employmentTypes', v) })),
    ...filters.selectedSkills.map(v => ({ label: `#${v}`, onRemove: () => toggleArray('selectedSkills', v) })),
    ...(filters.searchKeyword ? [{ label: `"${filters.searchKeyword}"`, onRemove: () => setFilters(p => ({ ...p, searchKeyword: '' })) }] : []),
  ];

  const hasActiveFilters = activePills.length > 0;

  // Close dropdown on outside click
  const handleOverlayClick = () => setOpenDropdown(null);

  return (
    <>
      {/* Overlay to close dropdowns */}
      {openDropdown && (
        <div className="fixed inset-0 z-20" onClick={handleOverlayClick} />
      )}

      {/* Main filter bar */}
      <div className="bg-white border-b border-slate-100 sticky top-[56px] z-20">
        <div className="max-w-screen-xl mx-auto px-6 py-2 flex items-center gap-2 flex-wrap">

          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex-1 min-w-[180px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Vị trí, công ty, kỹ năng..."
              value={filters.searchKeyword}
              onChange={e => setFilters(p => ({ ...p, searchKeyword: e.target.value }))}
              className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder:text-slate-400 w-full"
            />
            {filters.searchKeyword && (
              <button type="button" onClick={() => setFilters(p => ({ ...p, searchKeyword: '' }))} className="text-slate-300 hover:text-slate-500">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Chip dropdowns */}
          <Dropdown label={filters.industries.length ? `Ngành (${filters.industries.length})` : 'Ngành'} active={filters.industries.length > 0} isOpen={openDropdown === 'industry'} onToggle={() => toggle('industry')}>
            {INDUSTRIES.map(v => <DropdownItem key={v} label={v} checked={filters.industries.includes(v)} onClick={() => toggleArray('industries', v)} />)}
          </Dropdown>

          <Dropdown label={filters.levels.length ? `Level (${filters.levels.length})` : 'Level'} active={filters.levels.length > 0} isOpen={openDropdown === 'level'} onToggle={() => toggle('level')}>
            {LEVELS.map(v => <DropdownItem key={v} label={v} checked={filters.levels.includes(v)} onClick={() => toggleArray('levels', v)} />)}
          </Dropdown>

          <Dropdown label={filters.locations.length ? `Địa điểm (${filters.locations.length})` : 'Địa điểm'} active={filters.locations.length > 0} isOpen={openDropdown === 'location'} onToggle={() => toggle('location')}>
            {LOCATIONS.map(v => <DropdownItem key={v} label={v} checked={filters.locations.includes(v)} onClick={() => toggleArray('locations', v)} />)}
          </Dropdown>

          <Dropdown label={filters.sources.length ? `Nguồn (${filters.sources.length})` : 'Nguồn'} active={filters.sources.length > 0} isOpen={openDropdown === 'source'} onToggle={() => toggle('source')}>
            {SOURCES.map(v => <DropdownItem key={v} label={v} checked={filters.sources.includes(v)} onClick={() => toggleArray('sources', v)} />)}
          </Dropdown>

          <Dropdown label={filters.statuses.length ? `Trạng thái (${filters.statuses.length})` : 'Trạng thái'} active={filters.statuses.length > 0} isOpen={openDropdown === 'status'} onToggle={() => toggle('status')}>
            {STATUSES.map(v => <DropdownItem key={v} label={v} checked={filters.statuses.includes(v)} onClick={() => toggleArray('statuses', v)} />)}
          </Dropdown>

          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(p => !p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              showAdvanced
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            Lọc nâng cao
          </button>

          {/* Result count */}
          <div className="ml-auto text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
            {resultCount} kết quả
          </div>
        </div>

        {/* Advanced filter panel */}
        {showAdvanced && (
          <div className="border-t border-slate-100 bg-slate-50">
            <div className="max-w-screen-xl mx-auto px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="filter-label">Lương tối thiểu (triệu)</label>
                <input type="number" placeholder="VD: 3" min={0} className="input text-xs py-1.5"
                  value={filters.salaryRange.split('-')[0] || ''}
                  onChange={e => setFilters(p => ({ ...p, salaryRange: `${e.target.value}-${p.salaryRange.split('-')[1] || ''}` }))}
                />
              </div>
              <div>
                <label className="filter-label">Lương tối đa (triệu)</label>
                <input type="number" placeholder="VD: 15" min={0} className="input text-xs py-1.5"
                  value={filters.salaryRange.split('-')[1] || ''}
                  onChange={e => setFilters(p => ({ ...p, salaryRange: `${p.salaryRange.split('-')[0] || ''}-${e.target.value}` }))}
                />
              </div>
              <div>
                <label className="filter-label">Hạn nộp trước ngày</label>
                <input type="date" className="input text-xs py-1.5" />
              </div>
              <div>
                <label className="filter-label">Hình thức làm việc</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {EMP_TYPES.map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleArray('employmentTypes', v)}
                      className={`px-2 py-1 text-[10px] font-medium rounded-md border transition-all ${
                        filters.employmentTypes.includes(v)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit score */}
              <div>
                <label className="filter-label">MindX Fit Score</label>
                <div className="flex gap-1.5 mt-1">
                  {FIT_SCORES.map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleArray('fitScores', v)}
                      className={`px-2.5 py-1 text-[10px] font-semibold rounded-md border transition-all ${
                        filters.fitScores.includes(v)
                          ? v === 'High' ? 'bg-emerald-600 text-white border-emerald-600'
                          : v === 'Medium' ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-rose-500 text-white border-rose-500'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="col-span-2 sm:col-span-3">
                <label className="filter-label">Kỹ năng</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {popularSkills.slice(0, 12).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleArray('selectedSkills', s)}
                      className={`px-2 py-0.5 text-[10px] font-medium rounded border transition-all ${
                        filters.selectedSkills.includes(s)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="border-t border-slate-100 bg-white">
            <div className="max-w-screen-xl mx-auto px-6 py-2 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">Đang lọc:</span>
              {activePills.map((pill, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={pill.onRemove}
                  className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  {pill.label}
                  <X className="w-2.5 h-2.5" />
                </button>
              ))}
              <button type="button" onClick={onResetFilters} className="text-[11px] text-slate-400 hover:text-slate-600 underline ml-1">
                Xóa tất cả
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
