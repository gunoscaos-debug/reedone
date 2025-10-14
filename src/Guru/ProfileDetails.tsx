import React, { useEffect } from 'react';
import { GuruProfile } from './database';
import Button from '@/Komponen/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  tentang: z.string().min(1, 'Tentang Saya tidak boleh kosong.'),
  kualifikasi: z.string().min(1, 'Kualifikasi tidak boleh kosong.'),
  pengalaman: z.string().min(1, 'Pengalaman tidak boleh kosong.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileDetailsProps {
  profile: GuruProfile | null;
  onSave: (data: ProfileFormValues) => void;
  isEditing: boolean;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profile, onSave, isEditing }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      tentang: profile?.tentang || '',
      kualifikasi: profile?.kualifikasi || '',
      pengalaman: profile?.pengalaman || '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, isEditing, reset]);

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Edit Detail Profil</h2>
          <Button type="submit" form="profile-details-form" disabled={isSubmitting}>
            Simpan
          </Button>
        </div>
        
        <form id="profile-details-form" onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Tentang Saya
            </label>
            <textarea
              {...register('tentang')}
              className={`input-field min-h-[100px] ${errors.tentang ? 'border-red-500' : ''}`}
              rows={4}
            />
            {errors.tentang && <p className="mt-1 text-sm text-red-500">{errors.tentang.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Kualifikasi
            </label>
            <textarea
              {...register('kualifikasi')}
              className={`input-field min-h-[100px] ${errors.kualifikasi ? 'border-red-500' : ''}`}
              rows={4}
              placeholder="Masukkan kualifikasi, satu per baris"
            />
            {errors.kualifikasi && <p className="mt-1 text-sm text-red-500">{errors.kualifikasi.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Pengalaman Mengajar
            </label>
            <textarea
              {...register('pengalaman')}
              className={`input-field min-h-[100px] ${errors.pengalaman ? 'border-red-500' : ''}`}
              rows={4}
              placeholder="Masukkan pengalaman mengajar, satu per baris"
            />
            {errors.pengalaman && <p className="mt-1 text-sm text-red-500">{errors.pengalaman.message}</p>}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-6">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Detail Profil</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-slate-800 dark:text-white mb-2">Tentang Saya</h3>
          <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line text-sm">
            {profile?.tentang || 'Belum ada informasi tentang saya'}
          </p>
        </div>

        <div>
          <h3 className="font-medium text-slate-800 dark:text-white mb-2">Kualifikasi</h3>
          {profile?.kualifikasi ? (
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 whitespace-pre-line text-sm">
              {profile.kualifikasi.split('\n').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">Belum ada informasi kualifikasi</p>
          )}
        </div>

        <div>
          <h3 className="font-medium text-slate-800 dark:text-white mb-2">Pengalaman Mengajar</h3>
          {profile?.pengalaman ? (
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 whitespace-pre-line text-sm">
              {profile.pengalaman.split('\n').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">Belum ada informasi pengalaman mengajar</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;