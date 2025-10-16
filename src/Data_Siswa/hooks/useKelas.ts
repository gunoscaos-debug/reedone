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

  const addKelasMutation = useMutation<void, Error, Omit<Kelas, 'id'>>({
    mutationFn: async (newKelas) => {
      const existing = await db.kelas.where('nama').equalsIgnoreCase(newKelas.nama).first();
      if (existing) {
        throw new Error(`Kelas dengan nama "${newKelas.nama}" sudah ada.`);
      }
      await db.kelas.add(newKelas);
    },
    onSuccess: handleSuccess,
  });

  const updateKelasMutation = useMutation<void, Error, { id: string; updates: Partial<Kelas> }>({
    mutationFn: async ({ id, updates }) => {
      // Pastikan semua field yang relevan disertakan dalam pembaruan
      const dataToUpdate: Partial<Kelas> = {
        nama: updates.nama,
        waliKelas: updates.waliKelas,
        kontakWaliKelas: updates.kontakWaliKelas,
      };
      await db.kelas.update(id, dataToUpdate);
    },
    onSuccess: handleSuccess,
  });

  const deleteKelasMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      return db.kelas.delete(id);
    },
    onSuccess: handleSuccess,
  });

  return {
    kelasList,
    loading,
    error: error ? error.message : null,
    addKelas: addKelasMutation.mutateAsync,
    updateKelas: (id: string, updates: Partial<Kelas>) => updateKelasMutation.mutateAsync({ id, updates }),
    deleteKelas: deleteKelasMutation.mutateAsync,
  };
};
