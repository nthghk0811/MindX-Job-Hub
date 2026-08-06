import React, { useState } from 'react';
import { X, Sparkles, UserCheck, Send, ExternalLink, CheckCircle } from 'lucide-react';
import { JobItem, MindXStudent } from '../../types/job';

interface StudentMatchModalProps {
  job: JobItem | null;
  students: MindXStudent[];
  onClose: () => void;
  onSendJobToStudent: (studentName: string, jobTitle: string) => void;
}

export const StudentMatchModal: React.FC<StudentMatchModalProps> = ({
  job,
  students,
  onClose,
  onSendJobToStudent
}) => {
  if (!job) return null;

  const [sentStudents, setSentStudents] = useState<string[]>([]);

  // Calculate Match Score for each student
  const matchedStudents = students.map(student => {
    let score = 50; // base score

    // Industry match
    if (student.industry === job.industry) score += 25;

    // Location match
    if (student.preferredLocation === job.location || job.location === 'Remote') score += 15;

    // Skill overlap match
    const jobSkillsLower = job.skills.map(s => s.toLowerCase());
    const matchedSkillsCount = student.skills.filter(s => jobSkillsLower.includes(s.toLowerCase())).length;
    score += Math.min(matchedSkillsCount * 5, 20);

    return {
      ...student,
      matchScore: Math.min(score, 99)
    };
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const handleSend = (studentName: string) => {
    setSentStudents(prev => [...prev, studentName]);
    onSendJobToStudent(studentName, job.title);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-200 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Gợi Ý Học Viên Phù Hợp (Smart Student Matcher)</h3>
              <p className="text-xs text-slate-400">
                Thuật toán phân tích độ khớp về Kỹ năng, Ngành học & Địa điểm làm việc với Job: <strong className="text-rose-400">{job.title}</strong>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student List */}
        <div className="space-y-3">
          {matchedStudents.map(student => {
            const isSent = sentStudents.includes(student.fullName);

            return (
              <div
                key={student.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{student.fullName}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Match {student.matchScore}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{student.course}</p>
                  
                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {student.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 text-[10px] bg-slate-900 text-slate-300 border border-slate-800 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <a
                    href={student.cvLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 text-xs text-sky-400 hover:underline border border-sky-500/20 bg-sky-500/10 rounded-xl flex items-center"
                  >
                    <span>Xem CV</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>

                  <button
                    disabled={isSent}
                    onClick={() => handleSend(student.fullName)}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                      isSent
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/30'
                    }`}
                  >
                    {isSent ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Đã Gửi Job</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Gửi Cơ Hội Cho Bạn Này</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
