import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../database';
import { Siswa } from '../types/type';

const fetchSiswa = async () => {
  console.log('Fetching student data...');
  const data = await db.siswa.toArray();
  console.log('Student data fetched:', data);
  return data;
};

export const useSiswa = () => {
  const queryClient = useQueryClient();

  const { data: siswaList = [], isLoading: loading, error } = useQuery<Siswa[], Error>({
    queryKey: ['siswa'],
    queryFn: fetchSiswa,
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['siswa'] });
  };

  const addSiswaMutation = useMutation<void, Error, Omit<Siswa, 'id'>>({
    mutationFn: async (siswa) => {
      await db.siswa.add(siswa);
    },
    onSuccess: handleSuccess,
  });

  const updateSiswaMutation = useMutation<void, Error, { id: string; updates: Partial<Siswa> }>({
    mutationFn: async ({ id, updates }) => {
      await db.siswa.update(id, updates);
    },
    onSuccess: handleSuccess,
  });

  const deleteSiswaMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await db.siswa.delete(id);
    },
    onSuccess: handleSuccess,
  });

  const deleteSelectedSiswaMutation = useMutation<void, Error, Set<string>>({
    mutationFn: async (ids) => {
      const idArray = Array.from(ids);
      await db.siswa.bulkDelete(idArray);
    },
    onSuccess: handleSuccess,
  });

  return {
    siswaList,
    loading,
    error: error ? error.message : null,
    addSiswa: addSiswaMutation.mutateAsync,
    updateSiswa: (id: string, updates: Partial<Siswa>) => updateSiswaMutation.mutateAsync({ id, updates }),
    deleteSiswa: deleteSiswaMutation.mutateAsync,
    deleteSelectedSiswa: deleteSelectedSiswaMutation.mutateAsync,
  };
};
