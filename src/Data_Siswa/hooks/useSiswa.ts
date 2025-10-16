import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as siswaApi from '@/api/siswaApi';
import { db } from '@/data/database'; // For clearAllData
import { Siswa } from '../types/type';

const fetchSiswa = async () => {
  console.log('Fetching student data through API layer...');
  const data = await siswaApi.getAllSiswa();
  console.log('Student data fetched:', data);
  return data;
};

// TODO: Move this to a dedicated system API module
const clearAllData = async () => {
  console.log('Clearing all application data...');
  await Promise.all([
    db.students.clear(),
    db.subjects.clear(),
    db.grades.clear(),
  ]);
  console.log('All data cleared.');
};

export const useSiswa = () => {
  const queryClient = useQueryClient();
  
  const { data: siswaList = [], isLoading: loading, error } = useQuery<Siswa[], Error>({
    queryKey: ['siswa'],
    queryFn: fetchSiswa,
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['siswa'] });
    // Invalidate other queries if necessary
  };

  const addSiswaMutation = useMutation<number, Error, Omit<Siswa, 'id'>>({
    mutationFn: siswaApi.addSiswa,
    onSuccess: handleSuccess,
  });

  const bulkAddSiswaMutation = useMutation<void, Error, Omit<Siswa, 'id'>[]>({
    mutationFn: async (newSiswaList) => {
      // siswaApi doesn't have bulkAdd, so we can implement it here or add it to the api
      // For now, let's loop
      for (const siswa of newSiswaList) {
        await siswaApi.addSiswa(siswa);
      }
    },
    onSuccess: handleSuccess,
  });

  const updateSiswaMutation = useMutation<number, Error, { id: string; updates: Partial<Siswa> }>({
    mutationFn: async ({ id, updates }) => siswaApi.updateSiswa(id, updates),
    onSuccess: handleSuccess,
  });

  const deleteSiswaMutation = useMutation<void, Error, string>({
    mutationFn: siswaApi.deleteSiswa,
    onSuccess: handleSuccess,
  });

  const deleteSelectedSiswaMutation = useMutation<void, Error, Set<string>>({
    mutationFn: async (ids) => {
      const idArray = Array.from(ids);
      await siswaApi.bulkDeleteSiswa(idArray);
    },
    onSuccess: handleSuccess,
  });

  const clearAllDataMutation = useMutation<void, Error, void>({
    mutationFn: clearAllData,
    onSuccess: () => {
      handleSuccess();
      // Also invalidate other relevant queries
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
      queryClient.invalidateQueries({ queryKey: ['guruProfile'] });
      queryClient.invalidateQueries({ queryKey: ['nilai'] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['aiHistory'] });
    },
  });

  return {
    siswaList,
    loading,
    error: error ? error.message : null,
    addSiswa: addSiswaMutation.mutateAsync,
    bulkAddSiswa: bulkAddSiswaMutation.mutateAsync,
    updateSiswa: (id: string, updates: Partial<Siswa>) => updateSiswaMutation.mutateAsync({ id, updates }),
    deleteSiswa: deleteSiswaMutation.mutateAsync,
    deleteSelectedSiswa: deleteSelectedSiswaMutation.mutateAsync,
    clearAllData: clearAllDataMutation.mutateAsync,
  };
};