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
    // Jika total halaman lebih dari 0 dan halaman saat ini di luar jangkauan, reset ke halaman terakhir.
    // Jika total halaman adalah 0, reset ke halaman 1.
    const newTotalPages = Math.max(totalPages, 1);
    if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
  }, [data, currentPage, totalPages]);

  return {
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    paginatedData,
  };
};