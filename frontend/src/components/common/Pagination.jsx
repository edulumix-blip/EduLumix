import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Simple pagination for admin tables. Centered on page.
 * @param {number} currentPage - 1-based
 * @param {number} totalPages
 * @param {number} total - total items
 * @param {number} limit - items per page (default 30)
 * @param {function} onPageChange - (pageNum) => void
 */
const Pagination = ({ currentPage, totalPages, total, limit = 30, onPageChange }) => {
  if (totalPages <= 1 && total <= limit) return null;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-4 border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing <span className="font-medium text-gray-900 dark:text-white">{start}</span>–
        <span className="font-medium text-gray-900 dark:text-white">{end}</span> of{' '}
        <span className="font-medium text-gray-900 dark:text-white">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
