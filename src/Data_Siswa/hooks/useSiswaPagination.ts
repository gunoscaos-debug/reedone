import { useState, useMemo, useEffect } from 'react';
import { Siswa } from '../types/type';

export const useSiswaPagination = (data: Siswa[], initialRowsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const safeData = useMemo(() => data || [], [data]);
  const totalPages = useMemo(() => Math.ceil(safeData.length / rowsPerPage), [safeData.length, rowsPerPage]);

  const paginatedData = useMemo(() => {
    return safeData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [safeData, currentPage, rowsPerPage]);

  // Reset ke halaman 1 jika data berubah dan halaman saat ini menjadi tidak valid
  useEffect(() => {
    if (safeData.length > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [safeData, currentPage, totalPages]);

  return {
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    paginatedData,
  };
};