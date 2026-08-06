import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { JobItem, IndustryType, LevelType, LocationType, EmploymentType, SourceType, FitScoreType } from '../../types/job';
import { extractSkillsFromText } from '../../utils/skillExtractor';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (newJob: JobItem) => void;
}

const LABEL = 'block text-xs font-semibold text-slate-700 mb-1';

export const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose, onAddJob }) => {
  if (!isOpen) return null;

  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [title, setTitle] = useState('');
  const [industry, setIndustry] = useState<IndustryType>('Code');
  const [level, setLevel] = useState<LevelType>('Intern');
  const [location, setLocation] = useState<LocationType>('Hà Nội');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Internship');
  const [salary, setSalary] = useState('Thỏa thuận');
  const [deadline, setDeadline] = useState('2026-09-30');
  const [originalUrl, setOriginalUrl] = useState('');
  const [source, setSource] = useState<SourceType>('TopCV');
  const [mindxFitScore, setMindxFitScore] = useState<FitScoreType>('High');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [ssNotes, setSsNotes] = useState('');

  const handleAutoExtractSkills = () => {
    const extracted = extractSkillsFromText(`${description} ${requirements} ${skillsText}`);
    if (extracted.length > 0) setSkillsText(extracted.join(', '));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyName) return;

    const skillsArray = skillsText ? skillsText.split(',').map(s => s.trim()).filter(Boolean) : ['General'];

    const newJob: JobItem = {
      id: `job-${Date.now()}`,
      companyName,
      companyLogo: '',
      website: website || 'https://company.com',
      title,
      industry,
      level,
      location,
      employmentType,
      description: description || 'Mô tả công việc chi tiết.',
      requirements: requirements || 'Yêu cầu ứng viên cơ bản.',
      skills: skillsArray,
      salary: salary || 'Thỏa thuận',
      benefits: benefits || 'Đầy đủ chế độ theo luật lao động.',
      deadline: deadline || '2026-09-30',
      originalUrl: originalUrl || 'https://google.com',
      source,
      scrapedAt: new Date().toISOString().split('T')[0],
      status: 'Còn tuyển',
      mindxFitScore,
      ssNotes
    };

    onAddJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold text-slate-900">Thêm Job Mới (Nhập thủ công)</h2>
            <p className="text-xs text-slate-500 mt-0.5">Nhập thông tin khi không thể cào tự động từ nguồn</p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost p-2 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">

          {/* Row 1: title + company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Vị trí tuyển dụng *</label>
              <input type="text" required placeholder="VD: Thực tập sinh Node.js / ReactJS"
                value={title} onChange={e => setTitle(e.target.value)} className="input" />
            </div>
            <div>
              <label className={LABEL}>Tên công ty *</label>
              <input type="text" required placeholder="VD: Cốc Cốc Browser"
                value={companyName} onChange={e => setCompanyName(e.target.value)} className="input" />
            </div>
          </div>

          {/* Row 2: dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Ngành', val: industry, set: setIndustry, opts: ['Code', 'Data Analysis', 'Business Analysis'] },
              { label: 'Level', val: level, set: setLevel, opts: ['Intern', 'Fresher', 'Junior'] },
              { label: 'Địa điểm', val: location, set: setLocation, opts: ['Hà Nội', 'TP.HCM', 'Remote', 'Hybrid'] },
              { label: 'Nguồn', val: source, set: setSource, opts: ['TopCV', 'ITviec', 'LinkedIn', 'VietnamWorks', 'Ybox', 'Facebook Group'] },
            ].map(({ label, val, set, opts }) => (
              <div key={label}>
                <label className={LABEL}>{label}</label>
                <select value={val} onChange={e => (set as any)(e.target.value)} className="input">
                  {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Row 3: salary + deadline + url */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className={LABEL}>Mức lương / Trợ cấp</label>
              <input type="text" placeholder="VD: 3.000.000 - 5.000.000 VNĐ"
                value={salary} onChange={e => setSalary(e.target.value)} className="input" />
            </div>
            <div>
              <label className={LABEL}>Hạn nộp ứng tuyển</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="input" />
            </div>
            <div>
              <label className={LABEL}>Link JD gốc</label>
              <input type="url" placeholder="https://..." value={originalUrl} onChange={e => setOriginalUrl(e.target.value)} className="input" />
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className={LABEL}>Mô tả công việc (JD)</label>
            <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className="input resize-none" />
          </div>
          <div>
            <label className={LABEL}>Yêu cầu ứng viên</label>
            <textarea rows={2} value={requirements} onChange={e => setRequirements(e.target.value)} className="input resize-none" />
          </div>

          {/* Skills */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={LABEL.replace(' mb-1', '')}>Kỹ năng yêu cầu (phân cách bằng dấu phẩy)</label>
              <button type="button" onClick={handleAutoExtractSkills} className="text-[11px] text-indigo-600 hover:underline flex items-center gap-0.5">
                <Sparkles className="w-3 h-3" />
                Auto Extract
              </button>
            </div>
            <input type="text" placeholder="VD: ReactJS, Node.js, TypeScript, SQL"
              value={skillsText} onChange={e => setSkillsText(e.target.value)} className="input" />
          </div>

          {/* Fit + Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>MindX Fit Score</label>
              <select value={mindxFitScore} onChange={e => setMindxFitScore(e.target.value as FitScoreType)} className="input">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Ghi chú Team SS</label>
              <input type="text" placeholder="Ghi chú về HR, yêu cầu đặc biệt..."
                value={ssNotes} onChange={e => setSsNotes(e.target.value)} className="input" />
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-ghost">Hủy</button>
            <button type="submit" className="btn-primary">Lưu & Đăng Job</button>
          </div>

        </form>
      </div>
    </div>
  );
};
