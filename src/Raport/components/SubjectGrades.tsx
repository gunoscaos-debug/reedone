import React from 'react';
import { useRaportData } from '../contexts/useRaportData';
import { Siswa, Nilai } from '@/type';

interface SubjectGradesProps {
  selectedSiswa: Siswa | null;
}

const SubjectGrades: React.FC<SubjectGradesProps> = ({ selectedSiswa }) => {
  const { subjects, nilai, setNilai } = useRaportData();

  const handleNilaiChange = (mapelId: string, field: keyof Nilai, value: string) => {
    if (!selectedSiswa) return;

    const numValue = value === '' ? null : Number(value);
    
    setNilai(prev => {
      const newNilai = { ...prev };
      if (!newNilai[selectedSiswa.id]) {
        newNilai[selectedSiswa.id] = {};
      }
      if (!newNilai[selectedSiswa.id][mapelId]) {
        newNilai[selectedSiswa.id][mapelId] = {
          nh: null,
          uts: null,
          uas: null,
          na: null
        };
      }
      newNilai[selectedSiswa.id][mapelId][field] = numValue as never;
      return newNilai;
    });
  };

  if (!selectedSiswa) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">Pilih siswa terlebih dahulu</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Nilai Mata Pelajaran</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="p-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">Mata Pelajaran</th>
              <th className="p-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 w-24">NH</th>
              <th className="p-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 w-24">UTS</th>
              <th className="p-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 w-24">UAS</th>
              <th className="p-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 w-24">NA</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => {
              const nilaiSiswa = nilai[selectedSiswa.id]?.[subject.id] || {
                nh: null,
                uts: null,
                uas: null,
                na: null
              };

              return (
                <tr key={subject.id} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                  <td className="p-3 text-sm font-medium text-slate-800 dark:text-slate-200">{subject.nama}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={nilaiSiswa.nh ?? ''}
                      onChange={(e) => handleNilaiChange(subject.id, 'nh', e.target.value)}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md text-center bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-primary-500"
                      placeholder="-"
                      min="0"
                      max="100"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={nilaiSiswa.uts ?? ''}
                      onChange={(e) => handleNilaiChange(subject.id, 'uts', e.target.value)}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md text-center bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-primary-500"
                      placeholder="-"
                      min="0"
                      max="100"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={nilaiSiswa.uas ?? ''}
                      onChange={(e) => handleNilaiChange(subject.id, 'uas', e.target.value)}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md text-center bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-primary-500"
                      placeholder="-"
                      min="0"
                      max="100"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={nilaiSiswa.na ?? ''}
                      onChange={(e) => handleNilaiChange(subject.id, 'na', e.target.value)}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md text-center bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-primary-500"
                      placeholder="-"
                      min="0"
                      max="100"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectGrades;