import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db as apiDb, type GuruProfile, type ScheduleData } from '@/data/database';

// Fungsi untuk mengambil data profil. Mengembalikan profil atau null jika tidak ada.
const fetchGuruProfile = async (): Promise<GuruProfile | null> => {
  const profile = (await apiDb.guruProfiles.toArray())[0];
  return profile || null;
};

// Fungsi untuk membuat atau memperbarui profil guru.
const updateGuruProfile = async (data: Partial<GuruProfile>): Promise<GuruProfile> => {
  const existingProfile = (await apiDb.guruProfiles.toArray())[0];

  if (existingProfile?.id) {
    // Jika profil sudah ada, perbarui
    await apiDb.guruProfiles.update(existingProfile.id, data);
    const updatedProfile = await apiDb.guruProfiles.get(existingProfile.id);
    if (!updatedProfile) {
      throw new Error('Gagal mengambil profil setelah pembaruan.');
    }
    return updatedProfile;
  } else {
    // Jika profil belum ada, buat yang baru
    console.log('Tidak ada profil ditemukan, membuat profil baru di database...');
    const newProfileData: Omit<GuruProfile, 'id'> = {
      nama: data.nama || 'Nama Guru',
      nip: data.nip || '',
      mataPelajaran: data.mataPelajaran || 'Belum diatur',
      kelas: data.kelas || [],
      email: data.email || '',
      telepon: data.telepon || '',
      alamat: data.alamat || '',
      tanggalLahir: data.tanggalLahir || '',
      foto: data.foto || null,
      fotoLatar: data.fotoLatar || null,
      ...data,
    };
    const id = await apiDb.guruProfiles.add(newProfileData as GuruProfile);
    return { ...newProfileData, id } as GuruProfile;
  }
};

// Fungsi untuk mengambil data jadwal.
const fetchGuruSchedule = async (): Promise<ScheduleData | null> => {
  const schedule = (await apiDb.guruSchedules.toArray())[0];
  return schedule || null;
};

// Fungsi untuk membuat atau memperbarui jadwal guru.
const updateGuruSchedule = async (data: ScheduleData): Promise<ScheduleData> => {
  const existingSchedule = (await apiDb.guruSchedules.toArray())[0];
  if (existingSchedule?.id) {
    await apiDb.guruSchedules.update(existingSchedule.id, data);
    const updatedSchedule = await apiDb.guruSchedules.get(existingSchedule.id);
    if (!updatedSchedule) throw new Error('Gagal mengambil jadwal setelah pembaruan.');
    return updatedSchedule;
  } else {
    const id = await apiDb.guruSchedules.add(data);
    return { ...data, id };
  }
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

  const { data: schedule, isLoading: scheduleLoading } = useQuery({
    queryKey: ['guruSchedule'],
    queryFn: fetchGuruSchedule,
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

  const { mutateAsync: updateSchedule, isPending: isUpdatingSchedule } = useMutation({
    mutationFn: updateGuruSchedule,
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['guruSchedule'], updatedData);
    },
    onError: (error) => {
      console.error('Gagal memperbarui jadwal:', error);
    },
  });

  return {
    profile: profile || null,
    schedule: schedule || null,
    profileLoading: loading,
    scheduleLoading,
    isUpdating,
    isUpdatingSchedule,
    isError,
    error,
    updateProfile,
    updateSchedule,
    refreshData: () => queryClient.invalidateQueries({ queryKey: ['guruProfile'] }),
  };
};