import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db as apiDb, type GuruProfile } from '@/data/database';

// Fungsi untuk mengambil data profil. Jika tidak ada, buat dan kembalikan profil default.
const fetchGuruProfile = async (): Promise<GuruProfile> => {
  let profile = (await apiDb.guruProfiles.toArray())[0];

  if (!profile) {
    console.log('Tidak ada profil ditemukan, membuat profil default di database...');
    const defaultProfileData: Omit<GuruProfile, 'id'> = {
      nama: 'Nama Guru',
      nip: '',
      mataPelajaran: 'Belum diatur',
      kelas: [],
      email: '',
      telepon: '',
      alamat: '',
      tanggalLahir: '',
      foto: null,
      fotoLatar: null,
    };
    const id = await apiDb.guruProfiles.add(defaultProfileData as GuruProfile);
    profile = { ...defaultProfileData, id } as GuruProfile;
  }

  return profile;
};

// Fungsi ini sekarang hanya untuk memperbarui, karena fetch menjamin data ada.
const updateGuruProfile = async (data: Partial<GuruProfile>): Promise<GuruProfile> => {
  // Ambil ID profil yang ada. Seharusnya selalu ada satu.
  const existingProfile = (await apiDb.guruProfiles.toArray())[0];
  if (!existingProfile || !existingProfile.id) {
    throw new Error('Tidak dapat menemukan profil untuk diperbarui.');
  }

  await apiDb.guruProfiles.update(existingProfile.id, data);
  
  const updatedProfile = await apiDb.guruProfiles.get(existingProfile.id);
  if (!updatedProfile) {
    throw new Error('Gagal mengambil profil setelah pembaruan.');
  }

  return updatedProfile;
};

export const useGuruData = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading: loading, isError, error } = useQuery({
    queryKey: ['guruProfile'],
    queryFn: fetchGuruProfile,
    // Opsi ini penting agar query tidak otomatis refetch di background,
    // yang bisa menyebabkan data form ter-reset tiba-tiba.
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: updateGuruProfile,
    onSuccess: (updatedData) => {
      // Perbarui cache secara manual dengan data yang baru disimpan
      // Ini memberikan pengalaman pengguna yang lebih instan daripada invalidate
      queryClient.setQueryData(['guruProfile'], updatedData);
    },
    onError: (error) => {
      console.error('Gagal memperbarui profil:', error);
    },
  });

  return {
    // Karena fetchGuruProfile sekarang selalu mengembalikan profil,
    // kita tidak perlu lagi menangani kasus null di sini.
    profile: profile!,
    loading,
    isUpdating,
    isError,
    error,
    updateProfile,
    refreshData: () => queryClient.invalidateQueries({ queryKey: ['guruProfile'] }),
  };
};