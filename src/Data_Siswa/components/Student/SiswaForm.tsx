import React, { useEffect, useMemo } from 'react';
import { Siswa, Kelas } from '../../types/type';
import { User, X, Upload } from 'lucide-react';
import { useSiswa } from '../../hooks/useSiswa';
import Button from '@/Komponen/Button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface SiswaFormProps {
  onSubmit: (data: SiswaFormValues) => void;
  onCancel: () => void;
  kelasList: Kelas[];
  initialData?: Siswa | null; // Tetap gunakan Siswa untuk initialData
}

type SiswaFormValues = z.infer<typeof siswaSchema>;

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


const SiswaForm: React.FC<SiswaFormProps> = ({ onSubmit, onCancel, kelasList, initialData }) => {
  const isEditing = !!initialData;
  const { siswaList } = useSiswa();

  const siswaSchema = useMemo(() => z.object({
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
    const isNisnDuplicate = siswaList.some(
      siswa => siswa.nisn === data.nisn && siswa.id !== data.id
    );
    return !isNisnDuplicate;
  }, { message: 'NISN sudah digunakan oleh siswa lain.', path: ['nisn'] }), [siswaList]);

  const defaultFormValues = useMemo((): SiswaFormValues => ({
    nama: '',
    nisn: '',
    kelas: '',
    jenisKelamin: 'Laki-laki',
    status: 'Aktif',
    agama: 'Islam',
    jarakKeSekolah: 'Kurang dari 1km',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    kontakSiswa: '',
    namaOrangtua: '',
    kontakOrangtua: '',
    fotoUrl: '',
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
    reset(initialData ? { ...defaultFormValues, ...initialData } : defaultFormValues); // Tetap gunakan reset untuk menangani perubahan initialData setelah mount
  }, [initialData, reset, defaultFormValues, siswaSchema]);

  return (
    <div className="flex flex-col h-full">
      {/* Header Panel */}
      <div className="flex justify-between items-center p-4 border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h2>
        <Button variant="ghost" size="icon" onClick={onCancel} className="text-slate-500 hover:text-slate-800">
          <X />
        </Button>
      </div>
  <div className="flex-grow p-6 overflow-y-auto bg-white">
      <form id="siswa-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Kolom Kiri: Foto Siswa */}
          <div className="lg:w-1/3 flex flex-col items-center lg:items-start">
            <Controller
              name="fotoUrl"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    {field.value ? (
                      <img src={field.value} alt="Foto Siswa" className="w-48 h-48 rounded-lg object-cover border-2 border-gray-300" />
                    ) : (
                      <div className="w-48 h-48 rounded-lg bg-gray-200 flex items-center justify-center">
                        <User className="w-24 h-24 text-gray-400" />
                      </div>
                    )}
                    <label htmlFor="fotoUrl-input" className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                      <Upload size={18} />
                      <input
                        type="file"
                        id="fotoUrl-input"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const dataUrl = await readFileAsDataURL(file);
                            field.onChange(dataUrl);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">Pilih foto siswa (opsional)</p>
                </div>
              )}
            />
          </div>

          {/* Kolom Kanan: Data Siswa */}
          <div className="lg:w-2/3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Data Diri */}
              <div>
                <label htmlFor="nama" className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
                <input id="nama" type="text" {...register('nama')} className={`input-field mt-1 w-full bg-slate-50 border border-slate-300 ${errors.nama ? 'border-red-500' : ''}`} />
                {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama.message}</p>}
              </div>
              <div>
                <label htmlFor="nisn" className="block text-sm font-medium text-slate-700">NISN</label>
                <input id="nisn" type="text" {...register('nisn')} className={`input-field mt-1 w-full bg-slate-50 border border-slate-300 ${errors.nisn ? 'border-red-500' : ''}`} />
                {errors.nisn && <p className="mt-1 text-sm text-red-500">{errors.nisn.message}</p>}
              </div>
              <div>
                <label htmlFor="kelas" className="block text-sm font-medium text-slate-700">Kelas</label>
                <select id="kelas" {...register('kelas')} className={`input-field mt-1 w-full bg-slate-50 border border-slate-300 ${errors.kelas ? 'border-red-500' : ''}`}>
                  <option value="" disabled>Pilih Kelas</option>
                  {kelasList.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
                </select>
                {errors.kelas && <p className="mt-1 text-sm text-red-500">{errors.kelas.message}</p>}
              </div>
              <div>
                <label htmlFor="jenisKelamin" className="block text-sm font-medium text-slate-700">Jenis Kelamin</label>
                <select id="jenisKelamin" {...register('jenisKelamin')} className="input-field mt-1 w-full bg-slate-50 border border-slate-300">
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label htmlFor="tempatLahir" className="block text-sm font-medium text-slate-700">Tempat Lahir</label>
                <input id="tempatLahir" type="text" {...register('tempatLahir')} className="input-field mt-1 w-full bg-slate-50 border border-slate-300" />
              </div>
              <div>
                <label htmlFor="tanggalLahir" className="block text-sm font-medium text-slate-700">Tanggal Lahir</label>
                <input id="tanggalLahir" type="date" {...register('tanggalLahir')} className="input-field mt-1 w-full bg-slate-50 border border-slate-300" />
              </div>
              <div>
                <label htmlFor="agama" className="block text-sm font-medium text-slate-700">Agama</label>
                <select id="agama" {...register('agama')} className="input-field mt-1 w-full bg-slate-50 border border-slate-300">
                  <option>Islam</option>
                  <option>Kristen Protestan</option>
                  <option>Kristen Katolik</option>
                  <option>Hindu</option>
                  <option>Buddha</option>
                  <option>Khonghucu</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status Siswa</label>
                <select id="status" {...register('status')} className="input-field mt-1 w-full bg-slate-50 border border-slate-300">
                  <option>Aktif</option>
                  <option>Lulus</option>
                  <option>Pindah</option>
                  <option>Dikeluarkan</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="alamat" className="block text-sm font-medium text-slate-700">Alamat Lengkap</label>
                <textarea id="alamat" {...register('alamat')} rows={3} className="input-field mt-1 w-full bg-slate-50 border border-slate-300" />
              </div>
              <div>
                <label htmlFor="kontakSiswa" className="block text-sm font-medium text-slate-700">No. Telepon Siswa</label>
                <input id="kontakSiswa" type="tel" {...register('kontakSiswa')} className="input-field mt-1 w-full bg-slate-50 border border-slate-300" />
              </div>
              <div>
                <label htmlFor="jarakKeSekolah" className="block text-sm font-medium text-slate-700">Jarak ke Sekolah</label>
                <select id="jarakKeSekolah" {...register('jarakKeSekolah')} className="input-field mt-1 w-full bg-slate-50 border border-slate-300">
                  <option>Kurang dari 1km</option>
                  <option>1 - 3 km</option>
                  <option>3 - 5 km</option>
                  <option>5 - 10 km</option>
                  <option>Lebih dari 10km</option>
                </select>
              </div>
            </div>

            {/* Data Orang Tua */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-md font-semibold text-gray-800">Data Orang Tua / Wali</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="namaOrangtua" className="block text-sm font-medium text-slate-700">Nama Orang Tua/Wali</label>
                <input id="namaOrangtua" type="text" {...register('namaOrangtua')} className="input-field mt-1 w-full bg-slate-50 border border-slate-300" />
              </div>
              <div>
                <label htmlFor="kontakOrangtua" className="block text-sm font-medium text-slate-700">Kontak Orang Tua/Wali</label>
                <input id="kontakOrangtua" type="tel" {...register('kontakOrangtua')} className="input-field mt-1 w-full bg-slate-50 border border-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </form>
      </div>
      {/* Footer Panel */}
      <div className="p-4 border-t border-slate-200 sticky bottom-0 bg-white/80 backdrop-blur-sm">
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
          <Button type="submit" form="siswa-form" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Siswa')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SiswaForm;