import React, { useMemo } from 'react';
import { useRaportData } from '../contexts/useRaportData';
import { Siswa, Ekstrakurikuler } from '@/type';
import { calculateNilaiAkhir } from '../utils/gradeUtils';

interface RaportContentProps {
  selectedSiswa: Siswa | null;
  ekstrakurikulers: Ekstrakurikuler[];
}

const RaportContent: React.FC<RaportContentProps> = ({ selectedSiswa, ekstrakurikulers }) => {
  const { nilai, subjects } = useRaportData();
  
  // Hitung nilai akhir untuk setiap mata pelajaran
  const nilaiAkhirMap = useMemo(() => {
    if (!selectedSiswa) return {};
    
    const map: Record<string, number> = {};
    subjects.forEach(subject => {
      const nilaiSiswa = nilai[selectedSiswa.id]?.[subject.id];
      if (nilaiSiswa) {
        map[subject.id] = calculateNilaiAkhir(nilaiSiswa);
      }
    });
    return map;
  }, [selectedSiswa, nilai, subjects]);

  if (!selectedSiswa) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Pilih siswa untuk melihat raport</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header Raport */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase">{selectedSiswa.nama}</h1>
        <p className="text-gray-600">NISN: {selectedSiswa.nisn}</p>
        <p className="text-gray-600">Kelas: {selectedSiswa.kelas}</p>
      </div>

      {/* Nilai Akademik */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Nilai Akademik</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Mata Pelajaran</th>
                <th className="border p-2 text-center">Nilai Akhir</th>
                <th className="border p-2 text-center">Predikat</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="border p-2">{subject.nama}</td>
                  <td className="border p-2 text-center">
                    {nilaiAkhirMap[subject.id]?.toFixed(2) || '-'}
                  </td>
                  <td className="border p-2 text-center">
                    {nilaiAkhirMap[subject.id] 
                      ? (nilaiAkhirMap[subject.id] >= 85 ? 'A' : 
                         nilaiAkhirMap[subject.id] >= 75 ? 'B' : 
                         nilaiAkhirMap[subject.id] >= 60 ? 'C' : 'D')
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nilai Ekstrakurikuler */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Kegiatan Ekstrakurikuler</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Kegiatan Ekstrakurikuler</th>
                <th className="border p-2 text-center">Nilai</th>
                <th className="border p-2 text-center">Predikat</th>
              </tr>
            </thead>
            <tbody>
              {ekstrakurikulers.map((ekskul, index) => (
                <tr key={index}>
                  <td className="border p-2">{ekskul.nama}</td>
                  <td className="border p-2 text-center">{ekskul.nilai}</td>
                  <td className="border p-2 text-center">{ekskul.predikat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Catatan Wali Kelas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Catatan Wali Kelas</h2>
        <div className="border p-4 min-h-[100px]">
          {/* Placeholder untuk catatan wali kelas */}
        </div>
      </div>

      {/* Tanggapan Orang Tua */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Tanggapan Orang Tua/Wali</h2>
        <div className="border p-4 min-h-[100px]">
          {/* Placeholder untuk tanggapan orang tua */}
        </div>
      </div>
    </div>
  );
};

export default RaportContent;