import React, { useState } from 'react';
import { useSiswa } from '@/Data_Siswa/hooks/useSiswa';
import Button from '@/Komponen/Button';
import { ChevronRight } from 'lucide-react';

// This page is now responsible for Assessment, not Student Management.
// It fetches students from the central Data_Siswa module.

const PenilaianPage = () => {
  const { siswaList, loading, error } = useSiswa();
  const [selectedKelas, setSelectedKelas] = useState('');

  // Get unique classes from the student list
  const uniqueKelas = Array.from(new Set(siswaList.map(s => s.kelas)));

  const studentsInClass = selectedKelas ? siswaList.filter(s => s.kelas === selectedKelas) : [];

  const handleStartAssessment = (studentId: string) => {
    // TODO: Navigate to the actual assessment page for this student
    alert(`Memulai penilaian untuk siswa dengan ID: ${studentId}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Penilaian</h1>
          <p className="text-gray-600 mt-1">Pilih kelas untuk menampilkan siswa dan memulai penilaian.</p>
        </div>

        <div className="mb-6">
          <label htmlFor="kelas-select" className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Kelas
          </label>
          <select 
            id="kelas-select"
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="input-field w-full max-w-xs"
          >
            <option value="">Semua Kelas</option>
            {uniqueKelas.map(kelas => (
              <option key={kelas} value={kelas}>{kelas}</option>
            ))}
          </select>
        </div>

        <div className="bg-white shadow-md rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Daftar Siswa {selectedKelas && `Kelas ${selectedKelas}`}</h2>
          </div>
          
          {loading && <p className="p-4 text-center text-gray-500">Memuat data siswa...</p>}
          {error && <p className="p-4 text-center text-red-500">Error: {error}</p>}
          {!loading && !error && (
            <ul className="divide-y divide-gray-200">
              {(selectedKelas ? studentsInClass : siswaList).map(siswa => (
                <li key={siswa.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-150">
                  <div>
                    <p className="font-medium text-gray-900">{siswa.nama}</p>
                    <p className="text-sm text-gray-500">NISN: {siswa.nisn}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleStartAssessment(siswa.id)}>
                    Input Nilai <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </li>
              ))}
              {siswaList.length === 0 && <p className="p-4 text-center text-gray-500">Tidak ada data siswa. Silakan tambahkan siswa di menu Data Siswa.</p>}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PenilaianPage;