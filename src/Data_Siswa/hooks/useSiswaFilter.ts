import { useState, useMemo } from 'react';
import { Siswa } from '../types/type';

export const useSiswaFilter = (siswaList: Siswa[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKelas, setSelectedKelas] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return siswaList.filter(siswa => {
      const matchesSearch =
        siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (siswa.nisn && siswa.nisn.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = selectedKelas ? siswa.kelas === selectedKelas : true;
      return matchesSearch && matchesFilter;
    });
  }, [siswaList, searchTerm, selectedKelas]);

  return {
    searchTerm,
    setSearchTerm,
    selectedKelas,
    setSelectedKelas,
    filteredData,
  };
};