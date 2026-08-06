import React, { useState } from 'react';
import { X, Send, CheckCircle, ExternalLink } from 'lucide-react';
import { JobItem, MindXStudent } from '../../types/job';

interface StudentMatchModalProps {
  job: JobItem | null;
  students: MindXStudent[];
  onClose: () => void;
  onSendJobToStudent: (studentName: string, jobTitle: string) => void;
}

export const StudentMatchModal: React.FC<StudentMatchModalProps> = ({
  job, students, onClose, onSendJobToStudent
}) => {
  if (!job) return null;

  const [sentStudents, setSentStudents] = useState<string[]>([]);

  const matchedStudents = students.map(student => {
    let score = 50;
    if (student.industry === job.industry) score += 25;
    if (student.preferredLocation === job.location || job.location === 'Remote') score += 15;
    const jobSkillsLower = job.skills.map(s => s.toLowerCase());
    const matchCount = student.skills.filter(s => jobSkillsLower.includes(s.toLowerCase())).length;
    score += Math.min(matchCount * 5, 20);
    return { ...student, matchScore: Math.min(score, 99) };
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const handleSend = (studentName: string) => {
    setSentStudents(prev => [...prev, studentName]);
    onSendJobToStudent(studentName, job.title);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold text-slate-900">Gợi ý Học viên Phù hợp</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Phân tích độ khớp Kỹ năng · Ngành · Địa điểm với Job: <span className="font-semibold text-indigo-700">{job.title}</span>
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost p-2 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {matchedStudents.map(student => {
            const isSent = sentStudents.includes(student.fullName);
            const scoreColor = student.matchScore! >= 90 ? 'badge-green' : student.matchScore! >= 75 ? 'badge-blue' : 'badge-amber';

            return (
              <div
                key={student.id}
                className={`p-4 rounded-xl border transition-colors ${isSent ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{student.fullName}</span>
                      <span className={scoreColor}>Match {student.matchScore}%</span>
                    </div>
                    <p className="text-xs text-slate-500">{student.course}</p>
                    <div className="flex flex-wrap gap-1">
                      {student.skills.map(s => (
                        <span key={s} className="skill-pill pointer-events-none">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={student.cvLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost text-xs text-indigo-600"
                    >
                      Xem CV
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      type="button"
                      disabled={isSent}
                      onClick={() => handleSend(student.fullName)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                        isSent
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'btn-primary'
                      }`}
                    >
                      {isSent ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Đã gửi
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Gửi job cho bạn này
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
