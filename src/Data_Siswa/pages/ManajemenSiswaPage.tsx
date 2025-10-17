import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useSiswa } from '../hooks/useSiswa';
import { useSiswaFilter } from '../hooks/useSiswaFilter';
import { useSiswaSort } from '../hooks/useSiswaSort';
import { useSiswaPagination } from '../hooks/useSiswaPagination';
import SiswaTable from '../components/Student/SiswaTable';
import SiswaForm from '../components/Student/SiswaForm';
import SiswaTableControls from '../components/Student/SiswaTableControls';
import { Siswa } from '../types/type';
import Button from '@/Komponen/Button';
import PageHeader from '@/Komponen/PageHeader';
import { Upload, Download, BookCopy, Plus } from 'lucide-react';
import { useKelas } from '../hooks/useKelas';
import { toast } from 'react-hot-toast';
import ImportSiswaModal from '../components/Student/ImportSiswaModal';
import ManajemenKelasModal from "../pages/ManajemenKelasModal";
import Pagination from '@/Komponen/Pagination';

const showConfirmationToast = ({ message, onConfirm, confirmText = 'Ya, Hapus', confirmVariant = 'danger' }: any) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-4">
        <span>{message}</span>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => toast.dismiss(t.id)}>Batal</Button>
          <Button
            variant={confirmVariant}
            size="sm"
            onClick={async () => {
              toast.dismiss(t.id);
              await onConfirm();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    ), { duration: 10000 }
  );
};

const exportToExcel = (data: any[], fileName: string, sheetName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

const ManajemenSiswaPage: React.FC = () => {
  const { siswaList, loading, error, addSiswa, bulkAddSiswa, updateSiswa, deleteSiswa, deleteSelectedSiswa } = useSiswa();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
  const [selectedSiswaIds, setSelectedSiswaIds] = useState<Set<string>>(new Set());
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isKelasModalOpen, setIsKelasModalOpen] = useState(false);

  const { kelasList } = useKelas();
  const { searchTerm, setSearchTerm, filteredData } = useSiswaFilter(siswaList);
  const { sortedData: sortedSiswa, sortConfig, requestSort: handleSort } = useSiswaSort(filteredData, {}, () => '');

  const tableSortConfig = sortConfig 
    ? { 
        key: sortConfig.key as keyof Siswa, 
        direction: sortConfig.order === 'asc' ? 'ascending' as const : 'descending' as const 
      } 
    : null;

  const { paginatedData: paginatedSiswa, currentPage, totalPages, setCurrentPage } = useSiswaPagination(sortedSiswa, 10);

  const handleImport = () => setIsImportModalOpen(true);

  const handleImportSubmit = async (data: Omit<Siswa, 'id'>[]) => {
    try {
      await bulkAddSiswa(data);
      toast.success(`${data.length} siswa berhasil diimpor.`);
      setIsImportModalOpen(false);
    } catch (e) {
      console.error("Failed to import students:", e);
      toast.error('Gagal mengimpor data siswa.');
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ['nama', 'nisn', 'kelas', 'jenisKelamin', 'tempatLahir', 'tanggalLahir', 'alamat'];
    const emptyData = [Object.fromEntries(headers.map(h => [h, '']))];
    exportToExcel(emptyData, 'template_siswa', 'Template Siswa');
  };

  const handleExport = () => {
    const dataToExport = sortedSiswa.map(siswa => ({
      nama: siswa.nama,
      nisn: siswa.nisn,
      kelas: siswa.kelas,
      jenis_kelamin: siswa.jenisKelamin,
      tempat_lahir: siswa.tempatLahir,
      tanggal_lahir: siswa.tanggalLahir,
      alamat: siswa.alamat,
    }));
    exportToExcel(dataToExport, `data_siswa_${new Date().toISOString().split('T')[0]}`, 'Data Siswa');
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
    const siswaToDelete = siswaList.find(s => s.id === id);
    if (!siswaToDelete) return;
    const message = <>Apakah Anda yakin ingin menghapus siswa <strong>"{siswaToDelete.nama}"</strong>?</>;
    const handleConfirm = async () => {
      await deleteSiswa(id);
      toast.success(`Siswa "${siswaToDelete.nama}" berhasil dihapus.`);
    };
    showConfirmationToast({ message, onConfirm: handleConfirm });
  };

  const handleDeleteSelected = async () => {
    if (selectedSiswaIds.size === 0) return;
    const message = <>Apakah Anda yakin ingin menghapus <strong>{selectedSiswaIds.size} siswa</strong> yang dipilih?</>;
    const handleConfirm = async () => {
      await deleteSelectedSiswa(Array.from(selectedSiswaIds));
      setSelectedSiswaIds(new Set());
      toast.success(`${selectedSiswaIds.size} siswa berhasil dihapus.`);
    };
    showConfirmationToast({ message, onConfirm: handleConfirm });
  };

  const handleFormSubmit = async (siswa: Omit<Siswa, 'id'> | Siswa) => {
    if ('id' in siswa && siswa.id) {
      await updateSiswa(siswa.id, siswa);
      toast.success(`Data siswa "${siswa.nama}" berhasil diperbarui.`);
    } else {
      await addSiswa(siswa as Omit<Siswa, 'id'>);
      toast.success(`Siswa baru "${(siswa as Siswa).nama}" berhasil ditambahkan.`);
    }
    setIsFormOpen(false);
    setEditingSiswa(null);
  };

  const handleSelectionChange = (id: string, isSelected: boolean) => {
    setSelectedSiswaIds(prev => {
      const newSelection = new Set(prev);
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFormOpen(false);
        setIsImportModalOpen(false);
        setIsKelasModalOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-8xl mx-auto">
        <PageHeader 
          title="Manajemen Data Siswa"
          subtitle="Kelola data siswa, impor, ekspor, dan atur kelas."
        >
          <Button onClick={() => setIsKelasModalOpen(true)} variant="outline"><BookCopy className="w-4 h-4 mr-2" />Kelola Kelas</Button>
          <Button onClick={handleImport} variant="outline"><Upload className="w-4 h-4 mr-2" />Import</Button>
          <Button onClick={handleExport} variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
          <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" />Siswa Baru</Button>
        </PageHeader>

        <div className="bg-white shadow-lg rounded-xl border border-slate-200">
          <SiswaTableControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onDeleteSelected={handleDeleteSelected}
            hasSelection={selectedSiswaIds.size > 0}
          />
          
          {loading && <p className="text-center py-10 text-slate-500">Memuat data...</p>}
          {error && <p className="text-center py-10 text-red-500">Error: {error.message}</p>}
          {!loading && !error && (
            <SiswaTable
              siswaList={paginatedSiswa}
              onEdit={handleEdit}
              onDelete={handleDelete}
              sortConfig={tableSortConfig}
              onSort={handleSort}
              selectedSiswaIds={selectedSiswaIds}
              onSelectionChange={handleSelectionChange}
              onSelectAll={handleSelectAll}
            />
          )}

          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center">
              <span className="text-sm text-slate-600 mb-2 sm:mb-0">Menampilkan <span className="font-semibold">{paginatedSiswa.length}</span> dari <span className="font-semibold">{sortedSiswa.length}</span> hasil</span>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>
      </div>

      <ImportSiswaModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportSubmit}
        onDownloadTemplate={handleDownloadTemplate}
      />

      <ManajemenKelasModal isOpen={isKelasModalOpen} onClose={() => setIsKelasModalOpen(false)} />

      <div className={`fixed inset-0 z-40 transition-all duration-300 ${isFormOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity ${isFormOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsFormOpen(false)} />
        <div className={`absolute top-0 right-0 h-full bg-white shadow-2xl w-full max-w-2xl transform transition-transform duration-300 ease-in-out ${isFormOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            <SiswaForm
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
              kelasList={kelasList}
              siswaList={siswaList}
              initialData={editingSiswa}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default ManajemenSiswaPage;