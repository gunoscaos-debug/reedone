import React, { useEffect, forwardRef } from 'react';
import { GuruProfile } from './database';
import Button from '@/Komponen/Button';
import { X } from 'lucide-react';
import { useForm, Controller, UseFormRegister, FieldError, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';

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

// --- Helper Components for Cleaner Form ---

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  name: keyof ProfileHeaderFormValues;
  register: UseFormRegister<ProfileHeaderFormValues>;
  error?: FieldError;
  as?: 'input' | 'textarea';
}

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ label, name, register, error, as = 'input', ...props }, ref) => {
    const baseClasses = "input-field w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors";
    const errorClasses = "border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";
    const Element = as;

    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
        <Element
          id={name}
          {...register(name)}
          {...props}
          className={`${baseClasses} ${error ? errorClasses : ''}`}
          ref={ref as any}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      </div>
    );
  }
);

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ value, onChange }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const newTag = (e.target as HTMLInputElement).value.trim();
      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag]);
        (e.target as HTMLInputElement).value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="input-field flex items-center flex-wrap gap-2 w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500">
      {value.map((tag) => (
        <div key={tag} className="flex items-center bg-primary-100 text-primary-800 text-sm font-medium px-2.5 py-1 rounded-full">
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="ml-1.5 flex-shrink-0 text-primary-700 hover:text-primary-900">
            <X size={16} />
          </button>
        </div>
      ))}
      <input type="text" onKeyDown={handleKeyDown} className="bg-transparent outline-none flex-grow min-w-[120px]" placeholder={value.length > 0 ? '' : "Ketik kelas, lalu koma/enter"} />
    </div>
  );
};

// --- Helper Component for Displaying Profile Info ---

interface ProfileInfoItemProps {
  label: string;
  value?: string | string[] | null;
}

const ProfileInfoItem: React.FC<ProfileInfoItemProps> = ({ label, value }) => (
  <div>
    <dt className="text-sm font-medium text-slate-500">{label}</dt>
    <dd className="mt-1 text-lg font-semibold text-slate-800">{Array.isArray(value) ? value.join(', ') : (value || '-')}</dd>
  </div>
);

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
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Informasi Profil</h2>
        
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <ProfileInfoItem label="Nama Lengkap" value={profile?.nama} />
          <ProfileInfoItem label="Mata Pelajaran" value={profile?.mataPelajaran} />
          <div className="md:col-span-2">
            <ProfileInfoItem label="Kelas yang Diampu" value={profile?.kelas} />
          </div>
          <ProfileInfoItem label="NIP" value={profile?.nip} />
          <ProfileInfoItem label="Email" value={profile?.email} />
          <ProfileInfoItem label="Telepon" value={profile?.telepon} />
          <ProfileInfoItem label="Tanggal Lahir" value={profile?.tanggalLahir} />
          <div className="md:col-span-2">
            <ProfileInfoItem label="Alamat" value={profile?.alamat} />
          </div>
        </dl>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Edit Informasi Profil</h2>
      
      <form onSubmit={handleSubmit(onSave)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <FormField label="Nama Lengkap" name="nama" register={register} error={errors.nama} placeholder="Nama lengkap" />
          <FormField label="Mata Pelajaran" name="mataPelajaran" register={register} error={errors.mataPelajaran} placeholder="Mata pelajaran yang diampu" />
          
          <div className="md:col-span-2">
            <label htmlFor="kelas" className="block text-sm font-medium text-slate-700 mb-1">
              Kelas yang Diampu
            </label>
            <Controller
              name="kelas"
              control={control}
              render={({ field }) => <TagInput value={field.value} onChange={field.onChange} />}
            />
            {errors.kelas && <p className="mt-1 text-sm text-red-600">{errors.kelas.message}</p>}
            <p className="text-xs text-slate-500 mt-1.5">Pisahkan setiap kelas dengan koma atau Enter.</p>
          </div>

          <FormField label="NIP" name="nip" register={register} error={errors.nip} placeholder="Nomor Induk Pegawai" />
          <FormField label="Email" name="email" type="email" register={register} error={errors.email} placeholder="Alamat email" />
          <FormField label="Telepon" name="telepon" type="tel" register={register} error={errors.telepon} placeholder="Nomor telepon" />
          <FormField label="Tanggal Lahir" name="tanggalLahir" type="date" register={register} error={errors.tanggalLahir} />

          <div className="md:col-span-2">
            <FormField
              label="Alamat"
              name="alamat"
              register={register}
              error={errors.alamat}
              placeholder="Alamat lengkap"
              as="textarea"
              rows={3}
            />
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