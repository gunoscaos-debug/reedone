import React, { useState, useEffect } from 'react';
import { useSiswa } from '../hooks/useSiswa';
import { useSiswaFilter } from '../hooks/useSiswaFilter';
import { useSiswaSort } from '../hooks/useSiswaSort';
import { useSiswaPagination } from '../hooks/useSiswaPagination';
import SiswaTable from '../components/Student/SiswaTable';
import SiswaForm from '../components/Student/SiswaForm.tsx';
import SiswaTableControls from '../components/Student/SiswaTableControls';
import { Siswa } from '../types/type';
import Button from '@/Komponen/Button';
import KelasManager from '../components/Student/KelasManager';
import { Upload, Download } from 'lucide-react';
import { useKelas } from '@/Penilaian/hooks/useKelas';

const ManajemenSiswaPage: React.FC = () => {
  const { siswaList, loading, error, addSiswa, updateSiswa, deleteSiswa, deleteSelectedSiswa } = useSiswa();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
  const [selectedSiswaIds, setSelectedSiswaIds] = useState<Set<string>>(new Set());
  const [isKelasManagerOpen, setIsKelasManagerOpen] = useState(false);

  const {
    kelasList,
    addKelas,
    deleteKelas,
    updateKelas,
  } = useKelas();

  const { searchTerm, setSearchTerm, filteredData } = useSiswaFilter(siswaList);
  const { sortedData: sortedSiswa, sortConfig, requestSort: handleSort } = useSiswaSort(filteredData, {}, () => '');

  // Convert sortConfig from useSiswaSort format to SiswaTable format
  const tableSortConfig = sortConfig 
    ? { 
        key: sortConfig.key as keyof Siswa, 
        direction: sortConfig.order === 'asc' ? 'ascending' as const : 'descending' as const 
      } 
    : null;

  // Convert handleSort to match SiswaTable expected signature
  const handleTableSort = (key: keyof Siswa) => {
    handleSort(key as 'nama' | 'nisn' | 'kelas' | 'rata_ganjil' | 'rata_genap');
  };

  const { paginatedData: paginatedSiswa, currentPage, totalPages, setCurrentPage } = useSiswaPagination(sortedSiswa, 10);

  const handleManageKelas = () => {
    setIsKelasManagerOpen(true);
  };

  const handleImport = () => {
    // TODO: Implementasi logika import file (misalnya, menggunakan library seperti papaparse)
    alert('Fitur import file akan segera tersedia.');
  };

  const handleDownloadTemplate = () => {
    // TODO: Implementasi logika untuk membuat dan mengunduh file CSV/Excel template
    alert('Fitur unduh template akan segera tersedia.');
  };

  const handleAdd = () => {
    setEditingSiswa(null);
    setIsFormOpen(true);
  };

  const handleEdit = (siswa: Siswa) => {
    setEditingSiswa(siswa);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
      await deleteSiswa(id);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedSiswaIds.size === 0) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedSiswaIds.size} siswa yang dipilih?`)) {
      await deleteSelectedSiswa(selectedSiswaIds);
      setSelectedSiswaIds(new Set());
    }
  };

  const handleFormSubmit = async (siswa: Omit<Siswa, 'id'> | Siswa) => {
    if ('id' in siswa && siswa.id) {
      await updateSiswa(siswa.id, siswa);
    } else {
      await addSiswa(siswa as Omit<Siswa, 'id'>);
    }
    setIsFormOpen(false);
    setEditingSiswa(null);
  };

  const handleSelectionChange = (id: string, isSelected: boolean) => {
    setSelectedSiswaIds(prevSelection => {
      const newSelection = new Set(prevSelection);
      if (isSelected) {
        newSelection.add(id);
      } else {
        newSelection.delete(id);
      }
      return newSelection;
    });
  };

  const handleSelectAll = (areAllSelected: boolean) => {
    if (areAllSelected) {
      setSelectedSiswaIds(new Set(paginatedSiswa.map(s => s.id)));
    } else {
      setSelectedSiswaIds(new Set());
    }
  };

  // Menambahkan listener untuk menutup form dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFormOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Konten Utama (selalu terlihat) */}
      <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manajemen Data Siswa</h1>
            <div className="flex items-center space-x-2">
              <Button onClick={handleImport} variant="outline" className="flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Import File
              </Button>
              <Button onClick={handleDownloadTemplate} variant="outline" className="flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Unduh Template
              </Button>
              <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
                Tambah Siswa
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            <SiswaTableControls
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onDeleteSelected={handleDeleteSelected}
              hasSelection={selectedSiswaIds.size > 0}
              onManageKelasClick={handleManageKelas}
            />
            
            {loading && <p className="text-center text-gray-500 dark:text-gray-400">Memuat data...</p>}
            {error && <p className="text-center text-red-500">Error: {error}</p>}
            {!loading && !error && (
              <SiswaTable
                siswaList={paginatedSiswa}
                onEdit={handleEdit}
                onDelete={handleDelete}
                sortConfig={tableSortConfig}
                onSort={handleTableSort}
                selectedSiswaIds={selectedSiswaIds}
                onSelectionChange={handleSelectionChange}
                onSelectAll={handleSelectAll}
              />
            )}

            {totalPages > 1 && (
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <div>
                  <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="mr-2">
                    Sebelumnya
                  </Button>
                  <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Berikutnya
                  </Button>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Panel Samping untuk Form */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ${isFormOpen ? 'visible' : 'invisible'}`}>
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${isFormOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsFormOpen(false)}
        />
        {/* Panel Konten */}
        <div className={`absolute top-0 right-0 h-full bg-white dark:bg-slate-900 shadow-2xl w-full max-w-2xl transform transition-transform duration-300 ease-in-out ${isFormOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full overflow-y-auto">
            <SiswaForm
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
              kelasList={kelasList}
              initialData={editingSiswa}
            />
          </div>
        </div>
      </div>

      {isKelasManagerOpen && (
        <KelasManager
          isOpen={isKelasManagerOpen}
          onClose={() => setIsKelasManagerOpen(false)}
          kelasList={kelasList}
          onAddKelas={addKelas}
          onDeleteKelas={deleteKelas}
          onUpdateKelas={updateKelas}
        />
      )}
    </div>
  );
};

export default ManajemenSiswaPage;