import React, { useEffect, useMemo } from 'react';
import { Siswa, Kelas } from '../../types/type';
import { User, X, Upload } from 'lucide-react';
import Button from '@/Komponen/Button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Pindahkan skema ke luar komponen dan buat menjadi fungsi
const createSiswaSchema = (siswaList: Siswa[]) => z.object({
  id: z.string().optional(),
  nama: z.string().min(1, 'Nama lengkap wajib diisi.'),
  nisn: z.string().min(1, 'NISN wajib diisi.'),
  kelas: z.string().min(1, 'Kelas wajib dipilih.'),
  jenisKelamin: z.enum(['Laki-laki', 'Perempuan']),
  status: z.enum(['Aktif', 'Lulus', 'Pindah', 'Dikeluarkan']),
  agama: z.string().optional(),
  jarakKeSekolah: z.string().optional(),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional(),
  alamat: z.string().optional(),
  kontakSiswa: z.string().optional(),
  namaOrangtua: z.string().optional(),
  kontakOrangtua: z.string().optional(),
  fotoUrl: z.string().optional(),
}).refine(data => {
  if (!data.nisn) return true; // Jangan validasi jika NISN kosong
  const isNisnDuplicate = siswaList.some(
    siswa => siswa.nisn === data.nisn && siswa.id !== data.id
  );
  return !isNisnDuplicate;
}, { message: 'NISN sudah digunakan oleh siswa lain.', path: ['nisn'] });

type SiswaFormValues = z.infer<ReturnType<typeof createSiswaSchema>>;

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface SiswaFormProps {
  onSubmit: (data: SiswaFormValues) => void;
  onCancel: () => void;
  kelasList: Kelas[];
  siswaList: Siswa[]; // Terima siswaList sebagai prop
  initialData?: Siswa | null;
}

const SiswaForm: React.FC<SiswaFormProps> = ({ onSubmit, onCancel, kelasList, siswaList, initialData }) => {
  const isEditing = !!initialData;

  // Buat skema di dalam komponen menggunakan siswaList dari props
  const siswaSchema = useMemo(() => createSiswaSchema(siswaList), [siswaList]);

  const defaultFormValues = useMemo((): Partial<SiswaFormValues> => ({
    nama: '',
    nisn: '',
    kelas: '',
    jenisKelamin: 'Laki-laki',
    status: 'Aktif',
    agama: 'Islam',
    // ... dan field lainnya
  }), []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SiswaFormValues>({
    resolver: zodResolver(siswaSchema),
    defaultValues: initialData ? { ...defaultFormValues, ...initialData } : defaultFormValues,
  });

  useEffect(() => {
    reset(initialData ? { ...defaultFormValues, ...initialData } : defaultFormValues);
  }, [initialData, reset, defaultFormValues]);

  const inputBaseClass = "block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm";

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* ... (JSX tidak berubah secara signifikan, hanya memastikan semua prop benar) ... */}
    </div>
  );
};

export default SiswaForm;