import React, { useState } from 'react';
import { X, BookOpen, Presentation, Video, CheckCircle2, ChevronRight } from 'lucide-react';

interface SystemDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemDocsModal: React.FC<SystemDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'guide' | 'slides' | 'script'>('guide');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-200 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Tài Liệu Hướng Dẫn & Bộ Slide Thuyết Trình Dự Án</h3>
              <p className="text-xs text-slate-400">Tài nguyên phục vụ vận hành Team SS và Báo cáo nghiệm thu dự án MindX Job Hub</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'guide' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. HDSD Cho Team SS</span>
          </button>

          <button
            onClick={() => setActiveTab('slides')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'slides' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Presentation className="w-4 h-4" />
            <span>2. Slide Thuyết Trình</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'script' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>3. Kịch Bản Video Demo (3-5 Phút)</span>
          </button>
        </div>

        {/* Content Tabs */}
        {activeTab === 'guide' && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-300 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-rose-400">Quy Trình 4 Bước Cho Team Student Success (SS)</h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="font-bold text-white mb-1 flex items-center">
                  <ChevronRight className="w-4 h-4 text-rose-500 mr-1" />
                  Bước 1: Tìm kiếm & Lọc Job Phù Hợp
                </div>
                <p>Sử dụng Left Sidebar để lọc theo ngành (Code / Data / BA), địa điểm (Hà Nội / TP.HCM), level (Intern / Fresher) và Skill badges. Bấm vào bất kỳ Job Card nào để kiểm tra đủ 18 trường dữ liệu.</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="font-bold text-white mb-1 flex items-center">
                  <ChevronRight className="w-4 h-4 text-amber-500 mr-1" />
                  Bước 2: Sử Dụng Smart Student Matcher
                </div>
                <p>Bấm nút icon "Gợi ý Học viên phù hợp" tại Job Card để hệ thống tự động quét danh bạ học viên MindX và tính % Match CV.</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="font-bold text-white mb-1 flex items-center">
                  <ChevronRight className="w-4 h-4 text-emerald-500 mr-1" />
                  Bước 3: Tạo Bản Tin Job Hàng Tuần
                </div>
                <p>Chuyển qua Tab "Bản tin Tuần & Smart Match", bấm 1-Click Copy để lấy nội dung Markdown đã phân loại sẵn dạng Code, Data, BA gửi lên Discord/Telegram học viên.</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="font-bold text-white mb-1 flex items-center">
                  <ChevronRight className="w-4 h-4 text-sky-500 mr-1" />
                  Bước 4: Xuất File Excel / Google Sheets
                </div>
                <p>Vào Tab "Tools & Admin", chọn Export Excel để tải về file CSV báo cáo kết quả lọc job cho Quản lý.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'slides' && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-300 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">Nội Dung Slide Thuyết Trình (Pitch Deck)</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="font-bold text-rose-400">Slide 1: Bối cảnh & Vấn đề</span>
                <p className="mt-1 text-slate-400">Team SS tốn 3-4h/ngày tìm job thủ công từ TopCV, ITviec, LinkedIn... Dữ liệu rời rạc và dễ bị trùng lặp.</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="font-bold text-emerald-400">Slide 2: Giải pháp MindX Job Hub</span>
                <p className="mt-1 text-slate-400">Hệ thống thu thập bán tự động, lưu trữ DB 200+ jobs, chuẩn hóa 18 trường thông tin và chấm điểm MindX Fit Score.</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="font-bold text-sky-400">Slide 3: Chức năng Nâng cao</span>
                <p className="mt-1 text-slate-400">Tự động trích xuất Skill, Gợi ý học viên phù hợp (Smart Match), Lọc trùng Job (Deduplication) và Xuất Bản tin Tuần.</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400">Slide 4: Giá trị thực tế & ROI</span>
                <p className="mt-1 text-slate-400">Giảm 80% thời gian tìm kiếm job thủ công, tăng 3x tốc độ gửi cơ hội việc làm tới học viên sau khóa học.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'script' && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-300 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400">Kịch Bản Video Demo (Thời Lượng 3-5 Phút)</h4>
            
            <div className="space-y-2 font-mono text-[11px]">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <strong className="text-amber-400">[00:00 - 00:45]</strong> Giới thiệu tổng quan Dashboard & Giao diện Job Hub kiểu NEU Jobs.
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <strong className="text-amber-400">[00:45 - 01:45]</strong> Demo Bộ lọc thông minh Left Sidebar (Lọc Code/Data, HN/HCM, Level, Popular Skill pills).
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <strong className="text-amber-400">[01:45 - 02:30]</strong> Demo Inspector 18 Trường dữ liệu + Ghi chú SS Notes + Smart Student Matcher.
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <strong className="text-amber-400">[02:30 - 03:30]</strong> Demo Tool Cào Job (Scraper Live Log) & Công cụ Lọc trùng Job (Deduplication Merge/Delete).
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <strong className="text-amber-400">[03:30 - 04:30]</strong> Demo Analytics Dashboard & Xuất Bản tin Job Tuần 1-Click Copy.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
