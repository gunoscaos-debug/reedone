import React, { useState, useCallback } from 'react';
import { useSiswa } from '../hooks/useSiswa';
import { useKelas } from '../hooks/useKelas';
import { Siswa } from '../type';
import StudentTable from '../components/StudentTable';
import StudentForm from '../components/StudentForm';
import ClassManager from '../components/ClassManager';
import { Toaster, toast } from 'react-hot-toast';
import { UserPlus, Users } from 'lucide-react';
import { Button } from '@/Komponen/Button';

const ManajemenPenilaianPage: React.FC = () => {
  const {
    siswaList,
    addSiswa,
    updateSiswa,
    deleteSiswa,
    deleteSelectedSiswa,
    loading: siswaLoading,
    error: siswaError,
  } = useSiswa();

  const {
    kelasList,
    addKelas,
    deleteKelas,
    loading: kelasLoading,
    error: kelasError,
  } = useKelas();

  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSelectSiswa = useCallback((siswa: Siswa | null) => {
    setSelectedSiswa(siswa);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAddNewSiswa = () => {
    setSelectedSiswa(null);
    setIsFormVisible(true);
  };

  const handleSaveSiswa = async (siswa: Siswa) => {
    try {
      if (siswa.id) {
        await updateSiswa(siswa.id, siswa);
        toast.success('Data siswa berhasil diperbarui!');
      } else {
        await addSiswa(siswa);
        toast.success('Siswa baru berhasil ditambahkan!');
      }
      setIsFormVisible(false);
      setSelectedSiswa(null);
    } catch (e) {
      toast.error('Gagal menyimpan data siswa.');
      console.error(e);
    }
  };

  const handleDeleteSiswa = async (id: string) => {
    await deleteSiswa(id);
    toast.success('Siswa berhasil dihapus.');
    if (selectedSiswa?.id === id) {
      setSelectedSiswa(null);
      setIsFormVisible(false);
    }
  };

  const loading = siswaLoading || kelasLoading;
  const error = siswaError || kelasError;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-slate-50 dark:bg-slate-900/50 min-h-screen">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-600" />
            Manajemen Penilaian
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Kelola data siswa, kelas, dan penilaian.
          </p>
        </div>
        <Button onClick={handleAddNewSiswa}>
          <UserPlus className="mr-2 h-4 w-4" /> Tambah Siswa Baru
        </Button>
      </div>

      {isFormVisible && (
        <StudentForm
          selectedSiswa={selectedSiswa}
          kelasList={kelasList}
          onSave={handleSaveSiswa}
          onCancel={() => setIsFormVisible(false)}
        />
      )}

      <ClassManager kelasList={kelasList} onAddKelas={addKelas} onDeleteKelas={deleteKelas} />

      <StudentTable
        siswaList={siswaList}
        kelasList={kelasList}
        onSelectSiswa={handleSelectSiswa}
        onDeleteSiswa={handleDeleteSiswa}
        onDeleteSelected={deleteSelectedSiswa}
      />
    </div>
  );
};

export default ManajemenPenilaianPage;
