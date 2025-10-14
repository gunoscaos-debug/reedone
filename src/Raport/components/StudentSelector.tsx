import React from 'react';
import { useRaportData } from '../contexts/useRaportData';
import { User, ChevronDown } from 'lucide-react';

import { Siswa } from '@/type';

interface StudentSelectorProps {
  selectedSiswa: Siswa | null;
  onSelectSiswa: (siswa: Siswa | null) => void;
}

const StudentSelector: React.FC<StudentSelectorProps> = ({ selectedSiswa, onSelectSiswa }) => {
  const { siswaList, isLoading } = useRaportData();

  if (isLoading) {
    return (
      <div className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2 animate-pulse">
        <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <User className="w-5 h-5 text-slate-400" />
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown className="w-5 h-5 text-slate-400" />
      </div>
        <select
          id="student-select"
          value={selectedSiswa?.id || ''}
          onChange={(e) => {
            const selected = siswaList.find(s => s.id === Number(e.target.value));
            onSelectSiswa(selected || null);
          }}
          className="w-full pl-10 pr-10 p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-transparent"
        >
          <option value="">-- Pilih Siswa --</option>
          {siswaList.map((siswa) => (
            <option key={siswa.id} value={siswa.id} className="dark:bg-slate-700">
              {siswa.nama} ({siswa.kelas})
            </option>
          ))}
        </select>
    </div>
  );
};

export default StudentSelector; // Pastikan komponen bisa diimpor di tempat lain