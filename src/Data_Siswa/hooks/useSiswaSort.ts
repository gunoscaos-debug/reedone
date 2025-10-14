import { useMemo, useState } from 'react';
import { Siswa } from '../types/type';
import { Nilai } from '@/type';

export type SortKey = 'nama' | 'nisn' | 'kelas' | 'rata_ganjil' | 'rata_genap';
export type SortOrder = 'asc' | 'desc';

type CalculateRaporFn = (nilaiSiswa: Nilai | undefined, semester: 'ganjil' | 'genap') => string | number;

export const useSiswaSort = (
  data: Siswa[],
  nilai: Record<string, Nilai>,
  calculateNilaiRapor: CalculateRaporFn
) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder } | null>({ key: 'nama', order: 'asc' });

  const sortedData = useMemo(() => {
    const sortableData = [...(data || [])];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        if (sortConfig.key === 'rata_ganjil' || sortConfig.key === 'rata_genap') {
          aValue = calculateNilaiRapor(nilai[a.id], sortConfig.key === 'rata_ganjil' ? 'ganjil' : 'genap');
          bValue = calculateNilaiRapor(nilai[b.id], sortConfig.key === 'rata_ganjil' ? 'ganjil' : 'genap');
        } else {
          aValue = a[sortConfig.key as keyof Siswa] || '';
          bValue = b[sortConfig.key as keyof Siswa] || '';
        }

        if (aValue < bValue) return sortConfig.order === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.order === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig, nilai, calculateNilaiRapor]);

  const requestSort = (key: SortKey) => {
    let order: SortOrder = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.order === 'asc') {
      order = 'desc';
    }
    setSortConfig({ key, order });
  };

  return { sortedData, sortConfig, requestSort };
};