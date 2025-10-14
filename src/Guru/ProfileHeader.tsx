import React, { useEffect } from 'react';
import { GuruProfile } from './database';
import Button from '@/Komponen/Button';
import { X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileHeaderSchema = z.object({
  nama: z.string().min(1, 'Nama lengkap tidak boleh kosong.'),
  mataPelajaran: z.string().min(1, 'Mata pelajaran tidak boleh kosong.'),
  kelas: z.array(z.string()).default([]),
  nip: z.string().min(1, 'NIP tidak boleh kosong.'),
  email: z.string().email('Format email tidak valid.').min(1, 'Email tidak boleh kosong.'),
  telepon: z.string().optional(),
  alamat: z.string().optional(),
  tanggalLahir: z.string().optional(),
});

type ProfileHeaderFormValues = z.infer<typeof profileHeaderSchema>;

interface ProfileHeaderProps {
  profile: GuruProfile | null;
  onSave: (data: ProfileHeaderFormValues) => void;
  isEditing: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onSave, isEditing }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileHeaderFormValues>({
    resolver: zodResolver(profileHeaderSchema),
    defaultValues: {
      nama: profile?.nama || '',
      mataPelajaran: profile?.mataPelajaran || '',
      kelas: profile?.kelas || [],
      nip: profile?.nip || '',
      email: profile?.email || '',
      telepon: profile?.telepon || '',
      alamat: profile?.alamat || '',
      tanggalLahir: profile?.tanggalLahir || '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, isEditing, reset]);

  if (!isEditing) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Informasi Profil</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              Nama Lengkap
            </label>
            <p className="text-slate-800 dark:text-slate-200 font-medium">{profile?.nama || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              Mata Pelajaran
            </label>
            <p className="text-slate-800 dark:text-slate-200 font-medium">{profile?.mataPelajaran || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              Kelas
            </label>
            <p className="text-slate-800 dark:text-slate-200 font-medium">{Array.isArray(profile?.kelas) ? profile.kelas.join(', ') : profile?.kelas || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              NIP
            </label>
            <p className="text-slate-800 dark:text-slate-200 font-medium">{profile?.nip || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              Email
            </label>
            <p className="text-slate-800 dark:text-slate-200 font-medium">{profile?.email || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              Telepon
            </label>
            <p className="text-slate-800 dark:text-slate-200 font-medium">{profile?.telepon || '-'}</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              Alamat
            </label>
            <p className="text-slate-800 dark:text-slate-200 font-medium">{profile?.alamat || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              Tanggal Lahir
            </label>
            <p className="text-slate-800 dark:text-slate-200 font-medium">{profile?.tanggalLahir || '-'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-6">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Edit Informasi Profil</h2>
      
      <form onSubmit={handleSubmit(onSave)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              {...register('nama')}
              className={`input-field ${errors.nama ? 'border-red-500' : ''}`}
              placeholder="Nama lengkap"
            />
            {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Mata Pelajaran
            </label>
            <input
              type="text"
              {...register('mataPelajaran')}
              className={`input-field ${errors.mataPelajaran ? 'border-red-500' : ''}`}
              placeholder="Mata pelajaran yang diampu"
            />
            {errors.mataPelajaran && <p className="mt-1 text-sm text-red-500">{errors.mataPelajaran.message}</p>}
          </div>

          <Controller
            name="kelas"
            control={control}
            render={({ field }) => {
              const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === ',' || e.key === 'Enter') {
                  e.preventDefault();
                  const newKelas = (e.target as HTMLInputElement).value.trim();
                  if (newKelas && !field.value.includes(newKelas)) {
                    field.onChange([...field.value, newKelas]);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              };
              const removeKelas = (kelasToRemove: string) => {
                field.onChange(field.value.filter(k => k !== kelasToRemove));
              };
              return (
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Kelas
                  </label>
                  <div className="input-field flex items-center flex-wrap gap-2">
                    {field.value.map((k) => (
                      <div key={k} className="flex items-center bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 text-sm font-medium px-2 py-1 rounded-md">
                        {k}
                        <button type="button" onClick={() => removeKelas(k)} className="ml-2 text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      onKeyDown={handleKeyDown}
                      className="bg-transparent outline-none flex-grow"
                      placeholder={field.value.length > 0 ? '' : "Ketik kelas, lalu koma/enter"}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Pisahkan setiap kelas dengan koma atau Enter.</p>
                </div>
              );
            }}
          />
          
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              NIP
            </label>
            <input
              type="text"
              {...register('nip')}
              className={`input-field ${errors.nip ? 'border-red-500' : ''}`}
              placeholder="Nomor Induk Pegawai"
            />
            {errors.nip && <p className="mt-1 text-sm text-red-500">{errors.nip.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Alamat email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Telepon
            </label>
            <input
              type="tel"
              {...register('telepon')}
              className={`input-field ${errors.telepon ? 'border-red-500' : ''}`}
              placeholder="Nomor telepon"
            />
            {errors.telepon && <p className="mt-1 text-sm text-red-500">{errors.telepon.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Alamat
            </label>
            <textarea
              {...register('alamat')}
              className={`input-field min-h-[80px] ${errors.alamat ? 'border-red-500' : ''}`}
              placeholder="Alamat lengkap"
              rows={3}
            />
            {errors.alamat && <p className="mt-1 text-sm text-red-500">{errors.alamat.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Tanggal Lahir
            </label>
            <input
              type="date"
              {...register('tanggalLahir')}
              className={`input-field ${errors.tanggalLahir ? 'border-red-500' : ''}`}
            />
            {errors.tanggalLahir && <p className="mt-1 text-sm text-red-500">{errors.tanggalLahir.message}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileHeader;