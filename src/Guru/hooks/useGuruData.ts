import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, GuruProfile } from '../database';

// Fungsi untuk mengambil data profil. Ini harus berupa fungsi async.
const fetchGuruProfile = async (): Promise<GuruProfile | null> => {
  const profiles = await db.profile.toArray() as GuruProfile[];
  if (profiles.length > 0) {
    return profiles[0];
  }
  // Buat profil default jika belum ada, tapi jangan simpan di sini.
  // Biarkan useQuery mengembalikan null, dan komponen yang akan menanganinya.
  const defaultProfile: Omit<GuruProfile, 'id'> = {
    nama: '',
    nip: '',
    mataPelajaran: '',
    kelas: [],
    email: '',
    telepon: '',
    alamat: '',
    tanggalLahir: '',
    foto: null,
    fotoLatar: null,
    tentang: 'Saya adalah seorang guru berdedikasi tinggi...',
    kualifikasi: 'S1 Pendidikan...',
    pengalaman: '10+ tahun mengajar...'
  };
  return defaultProfile as GuruProfile;
};

// Fungsi untuk memperbarui data profil.
const updateGuruProfile = async (data: Partial<GuruProfile>): Promise<GuruProfile> => {
  const profiles = await db.profile.toArray();
  if (profiles.length > 0 && profiles[0].id) {
    await db.profile.update(profiles[0].id, data);
    return { ...profiles[0], ...data };
  } else {
    // Gabungkan profil saat ini (termasuk default) dengan data baru
    const newProfileData = { ...data } as GuruProfile;
    delete (newProfileData as Partial<GuruProfile>).id;
    const id = await db.profile.add(newProfileData);
    return { ...newProfileData, id: id as unknown as number };
  }
};

export const useGuruData = () => {
  const queryClient = useQueryClient();

  // 1. Gunakan `useQuery` untuk mengambil data
  const { data: profile, isLoading: loading, isError, error } = useQuery({
    queryKey: ['guruProfile'], // Kunci unik untuk query ini
    queryFn: fetchGuruProfile, // Fungsi yang akan dijalankan untuk mengambil data
  });

  // 2. Gunakan `useMutation` untuk mengubah (memperbarui) data
  const { mutateAsync: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: updateGuruProfile,
    onSuccess: (updatedData) => {
      // 3. Setelah berhasil, perbarui cache query 'guruProfile' secara manual
      queryClient.setQueryData(['guruProfile'], updatedData);
    },
  });

  return {
    profile: profile || null, // Kembalikan null jika data belum ada
    loading,
    isUpdating,
    isError,
    error,
    updateProfile, // Ini adalah fungsi yang akan dipanggil untuk update
    refreshData: () => queryClient.invalidateQueries({ queryKey: ['guruProfile'] }),
  };
};