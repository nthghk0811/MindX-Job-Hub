import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalItems === 0) return null;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-slate-200 mt-6 text-xs text-slate-500">
      {/* Left info & page size */}
      <div className="flex items-center gap-3">
        <span>
          Hiển thị <strong className="text-slate-800 font-semibold">{startItem} - {endItem}</strong> trên tổng số{' '}
          <strong className="text-indigo-600 font-bold">{totalItems.toLocaleString()}</strong> jobs
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <span className="text-slate-400">Hiển thị:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value={12}>12 / trang</option>
              <option value={24}>24 / trang</option>
              <option value={48}>48 / trang</option>
              <option value={96}>96 / trang</option>
            </select>
          </div>
        )}
      </div>

      {/* Right page navigation buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* First page */}
          <button
            type="button"
            onClick={() => handlePageClick(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Trang đầu"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>

          {/* Prev page */}
          <button
            type="button"
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Trang trước"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1 px-1">
            {getPageNumbers().map((p, idx) =>
              p === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400 text-xs">
                  ...
                </span>
              ) : (
                <button
                  key={`page-${p}`}
                  type="button"
                  onClick={() => handlePageClick(Number(p))}
                  className={`min-w-[30px] h-[30px] px-2 rounded-lg font-medium transition-all ${
                    currentPage === p
                      ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-200'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>

          {/* Next page */}
          <button
            type="button"
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Trang sau"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Last page */}
          <button
            type="button"
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Trang cuối"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
