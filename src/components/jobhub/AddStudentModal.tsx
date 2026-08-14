import React, { useState, useRef } from 'react';
import { X, UserPlus, UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react';
import { MindXStudent, IndustryType, LocationType } from '../../types/job';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Omit<MindXStudent, 'id'>) => Promise<void> | void;
  onBulkAddStudents: (students: Omit<MindXStudent, 'id'>[]) => Promise<void> | void;
}

const INDUSTRIES: IndustryType[] = ['Code', 'Data Analysis', 'Business Analysis'];
const LOCATIONS: LocationType[] = ['Hà Nội', 'TP.HCM', 'Remote', 'Hybrid'];

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
  onBulkAddStudents,
}) => {
  const [activeMode, setActiveMode] = useState<'manual' | 'import'>('manual');

  // Manual Form State
  const [fullName, setFullName] = useState('');
  const [course, setCourse] = useState('');
  const [industry, setIndustry] = useState<IndustryType>('Code');
  const [skillsText, setSkillsText] = useState('');
  const [preferredLocation, setPreferredLocation] = useState<LocationType>('Hà Nội');
  const [expectedSalary, setExpectedSalary] = useState('4.000.000 - 6.000.000 VNĐ');
  const [cvLink, setCvLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Import State
  const [parsedStudents, setParsedStudents] = useState<Omit<MindXStudent, 'id'>[]>([]);
  const [importErrors, setImportErrors] = useState<{ row: number; reason: string }[]>([]);
  const [importFileName, setImportFileName] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'parsing' | 'preview' | 'importing' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // ── Manual Submit ───────────────────────────────────
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !course.trim()) return;

    setIsSubmitting(true);
    const skills = skillsText
      .split(/[,;|]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await onAddStudent({
        fullName: fullName.trim(),
        course: course.trim(),
        industry,
        skills: skills.length > 0 ? skills : ['HTML/CSS', 'JavaScript'],
        preferredLocation,
        expectedSalary: expectedSalary.trim() || 'Thỏa thuận',
        cvLink: cvLink.trim() || '',
      });

      // Reset form & close
      setFullName('');
      setCourse('');
      setSkillsText('');
      setCvLink('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── File Parse ──────────────────────────────────────
  const handleFile = async (file: File) => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext || '')) {
      setImportStatus('error');
      setErrorMessage('Chỉ hỗ trợ định dạng .xlsx, .xls hoặc .csv');
      return;
    }

    setImportStatus('parsing');
    setImportFileName(file.name);
    setErrorMessage('');

    try {
      const items: Omit<MindXStudent, 'id'>[] = [];
      const errors: { row: number; reason: string }[] = [];

      const clean = (v: any) => String(v ?? '').replace(/\s+/g, ' ').trim();

      let rows: Record<string, any>[] = [];

      if (ext === 'xlsx' || ext === 'xls') {
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
      } else {
        const text = await file.text();
        const { data } = Papa.parse<Record<string, any>>(text, { header: true, skipEmptyLines: true });
        rows = data;
      }

      rows.forEach((r, idx) => {
        const rowNum = idx + 2;
        const name = clean(r['fullName'] || r['Họ và tên'] || r['Name'] || r['name'] || '');
        const cCourse = clean(r['course'] || r['Khóa học'] || r['Lớp'] || r['Course'] || '');

        if (!name) {
          errors.push({ row: rowNum, reason: 'Thiếu họ tên' });
          return;
        }

        const indRaw = clean(r['industry'] || r['Ngành'] || 'Code');
        const ind: IndustryType = (INDUSTRIES as string[]).includes(indRaw) ? (indRaw as IndustryType) : 'Code';

        const locRaw = clean(r['preferredLocation'] || r['Địa điểm'] || r['Location'] || 'Hà Nội');
        const loc: LocationType = (LOCATIONS as string[]).includes(locRaw) ? (locRaw as LocationType) : 'Hà Nội';

        const rawSkills = clean(r['skills'] || r['Kỹ năng'] || '');
        const skills = rawSkills ? rawSkills.split(/[,;|]+/).map((s) => s.trim()).filter(Boolean) : [];

        items.push({
          fullName: name,
          course: cCourse || 'Khóa học MindX',
          industry: ind,
          skills: skills.length > 0 ? skills : ['Kỹ năng chuyên môn'],
          preferredLocation: loc,
          expectedSalary: clean(r['expectedSalary'] || r['Mức lương mong muốn'] || r['Salary'] || 'Thỏa thuận'),
          cvLink: clean(r['cvLink'] || r['Link CV'] || r['CV'] || ''),
        });
      });

      setParsedStudents(items);
      setImportErrors(errors);
      setImportStatus('preview');
    } catch (err: any) {
      setImportStatus('error');
      setErrorMessage(err.message || 'Lỗi khi đọc file học viên');
    }
  };

  // ── Import Execute ──────────────────────────────────
  const handleExecuteImport = async () => {
    if (parsedStudents.length === 0) return;
    setImportStatus('importing');
    try {
      await onBulkAddStudents(parsedStudents);
      setImportStatus('done');
      setTimeout(() => {
        onClose();
        setImportStatus('idle');
        setParsedStudents([]);
      }, 1800);
    } catch (err: any) {
      setImportStatus('error');
      setErrorMessage(err.message || 'Lỗi khi lưu danh sách học viên');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Quản lý & Thêm Học viên MindX</h2>
              <p className="text-[11px] text-slate-500">Thêm từng hồ sơ học viên hoặc nhập danh sách từ file Excel/CSV</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 px-6 bg-white gap-6">
          <button
            type="button"
            onClick={() => setActiveMode('manual')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all ${
              activeMode === 'manual'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            + Thêm thủ công từng học viên
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('import')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeMode === 'import'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Import file Excel / CSV
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeMode === 'manual' ? (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên học viên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn An"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Khóa học / Lớp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="VD: Fullstack Web K72 (Hà Nội)"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngành đào tạo</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value as IndustryType)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none bg-white cursor-pointer"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Địa điểm mong muốn</label>
                  <select
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value as LocationType)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none bg-white cursor-pointer"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kỹ năng chuyên môn (cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="VD: ReactJS, Node.js, TypeScript, MongoDB, Git"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mức lương kỳ vọng</label>
                  <input
                    type="text"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder="VD: 5.000.000 - 8.000.000 VNĐ"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Đường dẫn CV (Google Drive / Link)</label>
                  <input
                    type="url"
                    value={cvLink}
                    onChange={(e) => setCvLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button type="button" onClick={onClose} className="btn-secondary text-xs py-2 px-4">
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !fullName.trim() || !course.trim()}
                  className="btn-primary text-xs py-2 px-5 disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu học viên'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Template download strip */}
              <div className="flex items-center justify-between bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 text-xs">
                <div className="flex items-center gap-2 text-indigo-900">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Dùng file Excel mẫu để đảm bảo đúng định dạng cột thông tin học viên.</span>
                </div>
                <a
                  href="/sample-students.xlsx"
                  download
                  className="font-bold text-indigo-700 hover:text-indigo-900 hover:underline flex items-center gap-1 shrink-0 ml-2"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Tải mẫu .xlsx
                </a>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  isDragOver
                    ? 'border-indigo-400 bg-indigo-50'
                    : importStatus === 'error'
                    ? 'border-rose-300 bg-rose-50'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                    e.target.value = '';
                  }}
                />

                {importStatus === 'idle' && (
                  <>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Kéo thả file hoặc Click để chọn</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Hỗ trợ .xlsx, .xls, .csv</p>
                    </div>
                  </>
                )}

                {importStatus === 'parsing' && (
                  <div className="flex flex-col items-center gap-1.5">
                    <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                    <p className="text-xs font-semibold text-slate-700">Đang đọc file {importFileName}...</p>
                  </div>
                )}

                {importStatus === 'error' && (
                  <div className="flex flex-col items-center gap-1">
                    <AlertCircle className="w-6 h-6 text-rose-500" />
                    <p className="text-xs font-bold text-rose-700">{errorMessage}</p>
                    <p className="text-[10px] text-indigo-600 underline">Click để thử lại</p>
                  </div>
                )}

                {importStatus === 'done' && (
                  <div className="flex flex-col items-center gap-1 text-emerald-700">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                    <p className="text-xs font-bold">Import thành công {parsedStudents.length} học viên!</p>
                  </div>
                )}

                {importStatus === 'preview' && (
                  <div className="flex items-center gap-2 text-indigo-700 text-xs">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span className="font-semibold">{importFileName}</span>
                    <span className="bg-indigo-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {parsedStudents.length} học viên
                    </span>
                  </div>
                )}
              </div>

              {/* Preview Table */}
              {importStatus === 'preview' && parsedStudents.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      Xem trước danh sách ({parsedStudents.length} học viên hợp lệ)
                    </span>
                    {importErrors.length > 0 && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                        {importErrors.length} dòng lỗi
                      </span>
                    )}
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full text-[11px]">
                      <thead className="bg-white border-b border-slate-100 sticky top-0 text-slate-400 font-medium">
                        <tr>
                          <th className="text-left px-3 py-1.5">#</th>
                          <th className="text-left px-3 py-1.5">Họ tên</th>
                          <th className="text-left px-3 py-1.5">Khóa học</th>
                          <th className="text-left px-3 py-1.5">Ngành</th>
                          <th className="text-left px-3 py-1.5">Địa điểm</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedStudents.map((st, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-3 py-1.5 text-slate-400">{i + 1}</td>
                            <td className="px-3 py-1.5 font-semibold text-slate-800">{st.fullName}</td>
                            <td className="px-3 py-1.5 text-slate-600">{st.course}</td>
                            <td className="px-3 py-1.5">
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-700">
                                {st.industry}
                              </span>
                            </td>
                            <td className="px-3 py-1.5 text-slate-600">{st.preferredLocation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setImportStatus('idle');
                        setParsedStudents([]);
                      }}
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      Chọn file khác
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteImport}
                      className="btn-primary text-xs py-1.5 px-4"
                    >
                      Xác nhận Import ({parsedStudents.length} học viên)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
