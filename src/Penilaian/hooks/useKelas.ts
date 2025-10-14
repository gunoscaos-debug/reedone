import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/Data_Siswa/database';
import { Kelas } from '@/Data_Siswa/types/type';

const fetchKelas = async () => {
  const data = await db.kelas.toArray();
  return data;
};

export const useKelas = () => {
  const queryClient = useQueryClient();

  const { data: kelasList = [], isLoading: loading, error } = useQuery<Kelas[], Error>({
    queryKey: ['kelas'],
    queryFn: fetchKelas,
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['kelas'] });
  };

  const addKelasMutation = useMutation<void, Error, { nama: string; waliKelas?: string; kontakWaliKelas?: string }>({
    mutationFn: async ({ nama, waliKelas, kontakWaliKelas }) => {
      const existing = kelasList.find(k => k.nama && k.nama.toLowerCase() === nama.toLowerCase());
      if (existing) return;
      await db.kelas.add({ nama, waliKelas, kontakWaliKelas });
    },
    onSuccess: handleSuccess,
  });

  const updateKelasMutation = useMutation<void, Error, { id: string; updates: Partial<Kelas> }>({
    mutationFn: async ({ id, updates }) => {
      await db.kelas.update(id, updates);
    },
    onSuccess: handleSuccess,
  });

  const deleteKelasMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await db.kelas.delete(id);
    },
    onSuccess: handleSuccess,
  });

  return {
    kelasList,
    loading,
    error: error ? error.message : null,
    addKelas: (nama: string, waliKelas?: string, kontakWaliKelas?: string) => addKelasMutation.mutateAsync({ nama, waliKelas, kontakWaliKelas }),
    updateKelas: (id: string, updates: Partial<Kelas>) => updateKelasMutation.mutateAsync({ id, updates }),
    deleteKelas: deleteKelasMutation.mutateAsync,
  };
};
