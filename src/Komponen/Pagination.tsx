import React, { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;
    const pageBuffer = 2;

    if (totalPages <= maxPagesToShow + pageBuffer) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const showLeftEllipsis = currentPage > pageBuffer + 1;
      const showRightEllipsis = currentPage < totalPages - pageBuffer;

      pages.push(1);
      if (showLeftEllipsis) {
        pages.push('...');
      }

      const startPage = Math.max(2, currentPage - (pageBuffer - 1));
      const endPage = Math.min(totalPages - 1, currentPage + (pageBuffer - 1));

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (showRightEllipsis) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    // Deduplicate ellipsis, e.g., [1, '...', 2, 3, 4] becomes [1, 2, 3, 4]
    return pages.filter((page, index) => {
      if (page === '...' && pages[index - 1] === '...') return false;
      if (page === '...' && typeof pages[index - 1] === 'number' && typeof pages[index + 1] === 'number' && pages[index + 1] === pages[index - 1] + 2) {
        pages.push(1);
        return false;
      }
      return true;
    });
  }, [totalPages, currentPage]);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Sebelumnya
      </button>
      
      <div className="flex">
        {pageNumbers.map((page, index) => {
          const isCurrent = page === currentPage;
          const isEllipsis = page === '...';
          const buttonClasses = `px-4 py-2 text-sm font-medium border-t border-b border-r ${
            isCurrent
              ? 'bg-blue-500 text-white border-blue-500 z-10'
              : isEllipsis
              ? 'bg-white text-gray-500 border-gray-300 cursor-default'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
          } ${index === 0 ? 'border-l rounded-l-none' : ''} ${
            index === pageNumbers.length - 1 ? 'rounded-r-md' : ''
          }`;
          return (<button
            key={index}
            onClick={() => typeof page === 'number' && goToPage(page)}
            disabled={isEllipsis}
            className={buttonClasses}
          >
            {page}
          </button>
        )})}
      </div>
      
      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Selanjutnya
      </button>
    </div>
  );
};

export default Pagination;