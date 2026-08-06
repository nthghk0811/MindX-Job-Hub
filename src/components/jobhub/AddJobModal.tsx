import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { JobItem, IndustryType, LevelType, LocationType, EmploymentType, SourceType, FitScoreType } from '../../types/job';
import { extractSkillsFromText } from '../../utils/skillExtractor';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (newJob: JobItem) => void;
}

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
    const combined = `${description} ${requirements} ${skillsText}`;
    const extracted = extractSkillsFromText(combined);
    if (extracted.length > 0) {
      setSkillsText(extracted.join(', '));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyName) return;

    const skillsArray = skillsText
      ? skillsText.split(',').map(s => s.trim()).filter(Boolean)
      : ['General'];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-200">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Thêm Job Mới Thủ Công (Manual Job Post)</h3>
              <p className="text-xs text-slate-400">Nhập thủ công thông tin công việc khi không crawl được từ nguồn tự động</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Vị Trí Tuyển Dụng *</label>
              <input
                type="text"
                required
                placeholder="VD: Thực tập sinh Node.js / ReactJS"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tên Công Ty *</label>
              <input
                type="text"
                required
                placeholder="VD: Cốc Cốc Browser"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ngành Phù Hợp</label>
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value as IndustryType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 focus:border-rose-500"
              >
                <option value="Code">Code</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Business Analysis">Business Analysis</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Level</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as LevelType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 focus:border-rose-500"
              >
                <option value="Intern">Intern</option>
                <option value="Fresher">Fresher</option>
                <option value="Junior">Junior</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Địa Điểm</label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value as LocationType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 focus:border-rose-500"
              >
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP.HCM">TP.HCM</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nguồn Thu Thập</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value as SourceType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 focus:border-rose-500"
              >
                <option value="TopCV">TopCV</option>
                <option value="ITviec">ITviec</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="VietnamWorks">VietnamWorks</option>
                <option value="Ybox">Ybox</option>
                <option value="Facebook Group">Facebook Group</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mức Lương / Trợ Cấp</label>
              <input
                type="text"
                placeholder="VD: 3.000.000 - 5.000.000 VNĐ"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Hạn Nộp Ứng Tuyển</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Link JD Gốc</label>
              <input
                type="url"
                placeholder="https://..."
                value={originalUrl}
                onChange={e => setOriginalUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Description & Requirements */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mô Tả Công Việc (JD)</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Yêu Cầu Ứng Viên</label>
            <textarea
              rows={2}
              value={requirements}
              onChange={e => setRequirements(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:border-rose-500"
            />
          </div>

          {/* Skills with Auto Extract */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">Kỹ Năng / Công Nghệ Yêu Cầu (Phân cách bởi dấu phẩy)</label>
              <button
                type="button"
                onClick={handleAutoExtractSkills}
                className="text-[11px] text-amber-400 hover:underline flex items-center"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Auto Extract Skill từ text
              </button>
            </div>
            <input
              type="text"
              placeholder="VD: ReactJS, Node.js, TypeScript, SQL"
              value={skillsText}
              onChange={e => setSkillsText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 focus:border-rose-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Ghi Chú SS Team</label>
            <input
              type="text"
              placeholder="Ghi chú thêm về HR, yêu cầu đặc biệt..."
              value={ssNotes}
              onChange={e => setSsNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 focus:border-rose-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-900/30"
            >
              Lưu & Đăng Job
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
