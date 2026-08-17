import React, { useState, useRef } from 'react';
import { UploadCloud, Download, CheckCircle, AlertCircle, X, FileSpreadsheet, Loader2, Info } from 'lucide-react';
import { JobItem } from '../../types/job';
import { exportJobsToCSV } from '../../utils/exportUtils';
import { parseImportFile } from '../../utils/parseImportFile';
import { importJobsFile } from '../../services/jobService';

interface ImportExportProps {
  jobs: JobItem[];
  onImportJobs: (imported: JobItem[]) => void;
}

interface ImportState {
  status: 'idle' | 'parsing' | 'preview' | 'importing' | 'done' | 'error';
  parsed:   Omit<JobItem, 'id'>[];
  parseErrors: { row: number; reason: string }[];
  imported: number;
  skipped:  number;
  errorMsg: string;
  fileName: string;
}

const INIT: ImportState = {
  status: 'idle', parsed: [], parseErrors: [],
  imported: 0, skipped: 0, errorMsg: '', fileName: '',
};

export const ImportExport: React.FC<ImportExportProps> = ({ jobs, onImportJobs }) => {
  const [state, setState] = useState<ImportState>(INIT);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<File | null>(null); // stores original File for bulk upload

  // ── Parse file ──────────────────────────────────────
  async function handleFile(file: File) {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext || '')) {
      setState(s => ({ ...s, status: 'error', errorMsg: 'Chỉ hỗ trợ file .xlsx, .xls hoặc .csv' }));
      return;
    }

    setState({ ...INIT, status: 'parsing', fileName: file.name });
    fileRef.current = file; // store for later bulk upload
    try {
      const { jobs: parsed, errors } = await parseImportFile(file);
      setState(s => ({
        ...s,
        status: 'preview',
        parsed,
        parseErrors: errors,
        fileName: file.name,
      }));
    } catch (e: any) {
      setState(s => ({ ...s, status: 'error', errorMsg: e.message || 'Lỗi đọc file' }));
    }
  }

  // ── Import vào DB — single bulk file upload ──────────
  async function handleImport() {
    if (!fileRef.current) return;
    setState(s => ({ ...s, status: 'importing' }));
    try {
      const result = await importJobsFile(fileRef.current);
      // importJobsFile sends the raw file to POST /api/jobs/import (server-side parse + bulk insert)
      const inserted: number = result.inserted ?? 0;
      const skipped: number  = result.skipped  ?? 0;
      // Trigger parent refresh — pass empty array since server handled insert
      onImportJobs([]);
      setState(s => ({ ...s, status: 'done', imported: inserted, skipped }));
    } catch (e: any) {
      setState(s => ({ ...s, status: 'error', errorMsg: e.message || 'Lỗi import lên server' }));
    }
  }

  // ── Drag & Drop handlers ────────────────────────────
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  // ── Render ──────────────────────────────────────────
  return (
    <div className="card p-6 space-y-5">

      <div className="border-b border-slate-100 pb-4 flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Import & Export Dữ liệu</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Nhập danh sách job từ file Excel / CSV thực hoặc xuất dữ liệu cho Team SS.
          </p>
        </div>
        {/* Download template */}
        <a
          href="/sample-jobs.xlsx"
          download
          className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 shrink-0 mt-0.5"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Tải file mẫu
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* ── Import zone ── */}
        <div className="space-y-3">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={onDrop}
            onClick={() => state.status === 'idle' || state.status === 'error' ? fileInputRef.current?.click() : undefined}
            className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
              isDragOver
                ? 'border-indigo-400 bg-indigo-50'
                : state.status === 'error'
                ? 'border-rose-300 bg-rose-50'
                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
            }`}
          >
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={onFileChange} />

            {state.status === 'idle' && (
              <>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDragOver ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                  <UploadCloud className={`w-6 h-6 ${isDragOver ? 'text-indigo-600' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Kéo & Thả hoặc Click để chọn file</p>
                  <p className="text-xs text-slate-400 mt-0.5">Hỗ trợ .xlsx, .xls, .csv · Tối đa 10MB</p>
                </div>
              </>
            )}

            {state.status === 'parsing' && (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-sm font-semibold text-slate-700">Đang đọc file...</p>
                <p className="text-xs text-slate-400">{state.fileName}</p>
              </div>
            )}

            {state.status === 'error' && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                </div>
                <p className="text-sm font-semibold text-rose-700">{state.errorMsg}</p>
                <p className="text-xs text-indigo-600 underline">Click để chọn file khác</p>
              </div>
            )}

            {state.status === 'done' && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-emerald-700">Import thành công!</p>
                <p className="text-xs text-slate-500">
                  <span className="text-emerald-700 font-bold">{state.imported}</span> job mới ·{' '}
                  <span className="text-slate-500">{state.skipped}</span> bỏ qua (trùng)
                </p>
              </div>
            )}
          </div>

          {/* Reset */}
          {(state.status === 'preview' || state.status === 'importing' || state.status === 'done') && (
            <button
              onClick={() => setState(INIT)}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Reset / Import file khác
            </button>
          )}
        </div>

        {/* ── Export ── */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Xuất dữ liệu cho Team SS</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Xuất toàn bộ <strong>{jobs.length} jobs</strong> thành file CSV chuẩn UTF-8 – tương thích Excel và Google Sheets.
            </p>
          </div>
          <button
            type="button"
            onClick={() => exportJobsToCSV(jobs)}
            className="btn-primary w-full justify-center"
          >
            <Download className="w-4 h-4" />
            Tải xuống CSV ({jobs.length} Job)
          </button>
        </div>
      </div>

      {/* ── Preview panel ── */}
      {state.status === 'preview' && state.parsed.length > 0 && (
        <div className="border border-indigo-200 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-bold text-indigo-800">{state.fileName}</span>
              <span className="text-xs text-indigo-600 bg-white border border-indigo-200 px-2 py-0.5 rounded-full">
                {state.parsed.length} job hợp lệ
              </span>
              {state.parseErrors.length > 0 && (
                <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  {state.parseErrors.length} dòng lỗi
                </span>
              )}
            </div>
            <button
              onClick={handleImport}
              className="btn-primary text-xs py-1.5 px-4"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Import vào DB
            </button>
          </div>

          {/* Job preview table */}
          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                <tr>
                  {['#', 'Công ty', 'Vị trí', 'Ngành', 'Level', 'Địa điểm', 'Fit Score'].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-slate-500 font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.parsed.map((job, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium text-slate-800 whitespace-nowrap max-w-[140px] truncate">{job.companyName}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap max-w-[180px] truncate">{job.title}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        job.industry === 'Code' ? 'bg-indigo-100 text-indigo-700'
                        : job.industry === 'Data Analysis' ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                      }`}>{job.industry}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{job.level}</td>
                    <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{job.location}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`font-bold ${
                        job.mindxFitScore === 'High' ? 'text-emerald-600'
                        : job.mindxFitScore === 'Medium' ? 'text-amber-600'
                        : 'text-slate-400'
                      }`}>{job.mindxFitScore}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Parse errors */}
          {state.parseErrors.length > 0 && (
            <div className="px-4 py-3 bg-amber-50 border-t border-amber-100">
              <p className="text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> {state.parseErrors.length} dòng bị bỏ qua:
              </p>
              {state.parseErrors.slice(0, 5).map((e, i) => (
                <p key={i} className="text-xs text-amber-700">• Dòng {e.row}: {e.reason}</p>
              ))}
              {state.parseErrors.length > 5 && (
                <p className="text-xs text-amber-500">...và {state.parseErrors.length - 5} dòng khác</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Importing progress */}
      {state.status === 'importing' && (
        <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <Loader2 className="w-5 h-5 text-indigo-500 animate-spin shrink-0" />
          <div>
            <p className="text-sm font-bold text-indigo-800">Đang import vào MongoDB...</p>
            <p className="text-xs text-indigo-600">Đang tạo {state.parsed.length} jobs, vui lòng chờ</p>
          </div>
        </div>
      )}

      {/* Hướng dẫn format */}
      <div className="text-xs text-slate-400 bg-slate-50 rounded-xl p-3 space-y-1 border border-slate-100">
        <p className="font-semibold text-slate-600">📋 Cột bắt buộc trong file:</p>
        <p><span className="font-mono bg-white px-1 rounded border border-slate-200">title</span>, <span className="font-mono bg-white px-1 rounded border border-slate-200">companyName</span> — các cột còn lại sẽ được tự động điền mặc định.</p>
        <p>Tải <strong>file mẫu</strong> ở góc trên bên phải để xem đúng định dạng cột.</p>
      </div>
    </div>
  );
};
