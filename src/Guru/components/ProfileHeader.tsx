import React, { useEffect, forwardRef } from 'react';
import type { GuruProfile } from '@/data/database'; // Pastikan path ini benar
import Button from '@/Komponen/Button';
import { X, User, Book, Users, Hash, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useForm, Controller, UseFormRegister, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Skema untuk validasi saat mengedit profil.
// Beberapa field dibuat wajib untuk memastikan data penting terisi.
const profileSchema = z.object({
  nama: z.string().min(1, "Nama lengkap tidak boleh kosong."),
  mataPelajaran: z.string().min(1, "Mata pelajaran tidak boleh kosong."),
  kelas: z.array(z.string()).default([]),
  nip: z.string().optional().or(z.literal('')),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  telepon: z.string().optional().or(z.literal('')),
  alamat: z.string().optional().or(z.literal('')),
  tanggalLahir: z.string().optional().or(z.literal('')),
});


type ProfileFormValues = z.infer<typeof profileSchema>;

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const TagInput = forwardRef<HTMLInputElement, TagInputProps>(({ value = [], onChange }, ref) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleAddTag = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      handleRemoveTag(value[value.length - 1]);
    }
  };

  return (
    <div className="border border-slate-300 rounded-lg p-2 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1.5 inline-flex text-primary-600 hover:text-primary-800 focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        ref={ref}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="block w-full border-0 focus:ring-0 p-0 text-sm text-slate-900 placeholder-slate-500"
        placeholder={value.length === 0 ? "Tambahkan kelas (tekan Enter)" : ""}
      />
    </div>
  );
});

interface FormFieldProps {
  name: keyof ProfileFormValues;
  label: string;
  register: UseFormRegister<ProfileFormValues>;
  error?: FieldError;
  placeholder?: string;
  type?: string;
  as?: 'input' | 'textarea';
  icon?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  register,
  error,
  placeholder,
  type = 'text',
  as: Component = 'input',
  icon,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <Component
        id={name}
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={`block w-full ${icon ? 'pl-10' : ''} rounded-md border-slate-300 focus:border-primary-500 focus:ring-primary-500 text-sm`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        rows={Component === 'textarea' ? 3 : undefined}
      />
    </div>
    {error && <p id={`${name}-error`} className="mt-1 text-sm text-red-600">{error.message}</p>}
  </div>
);

interface ProfileHeaderProps {
  profile: GuruProfile;
  onSave: (data: ProfileFormValues) => void;
  isEditing: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onSave, isEditing }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile || {},
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
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <div className="flex items-start space-x-4"><div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary-50 text-primary-500"><User size={20} /></div><div><dt className="text-sm font-medium text-slate-500">Nama Lengkap</dt><dd className="mt-1 text-lg font-semibold text-slate-800">{profile.nama || '-'}</dd></div></div>
          <div className="flex items-start space-x-4"><div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary-50 text-primary-500"><Book size={20} /></div><div><dt className="text-sm font-medium text-slate-500">Mata Pelajaran</dt><dd className="mt-1 text-lg font-semibold text-slate-800">{profile.mataPelajaran || '-'}</dd></div></div>
          <div className="md:col-span-2 flex items-start space-x-4"><div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary-50 text-primary-500"><Users size={20} /></div><div><dt className="text-sm font-medium text-slate-500">Kelas yang Diampu</dt><dd className="mt-1 text-lg font-semibold text-slate-800">{profile.kelas && profile.kelas.length > 0 ? profile.kelas.join(', ') : '-'}</dd></div></div>
          <div className="flex items-start space-x-4"><div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary-50 text-primary-500"><Hash size={20} /></div><div><dt className="text-sm font-medium text-slate-500">NIP/NUPTK</dt><dd className="mt-1 text-lg font-semibold text-slate-800">{profile.nip || '-'}</dd></div></div>
          <div className="flex items-start space-x-4"><div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary-50 text-primary-500"><Calendar size={20} /></div><div><dt className="text-sm font-medium text-slate-500">Tanggal Lahir</dt><dd className="mt-1 text-lg font-semibold text-slate-800">{profile.tanggalLahir || '-'}</dd></div></div>
          <div className="md:col-span-2 flex items-start space-x-4"><div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary-50 text-primary-500"><MapPin size={20} /></div><div><dt className="text-sm font-medium text-slate-500">Alamat</dt><dd className="mt-1 text-lg font-semibold text-slate-800">{profile.alamat || '-'}</dd></div></div>
        </dl>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Edit Informasi Profil</h2>
      <form onSubmit={handleSubmit(onSave)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField name="nama" label="Nama Lengkap" register={register} error={errors.nama} placeholder="Nama lengkap" icon={<User className="h-5 w-5 text-gray-400" />} />
          <FormField name="mataPelajaran" label="Mata Pelajaran" register={register} error={errors.mataPelajaran} placeholder="Mata pelajaran" icon={<Book className="h-5 w-5 text-gray-400" />} />
          <div className="md:col-span-2">
            <label htmlFor="kelas" className="block text-sm font-medium text-slate-700 mb-1">Kelas yang Diampu</label>
            <Controller name="kelas" control={control} render={({ field }) => <TagInput value={field.value || []} onChange={field.onChange} />} />
          </div>
          <FormField name="nip" label="NIP/NUPTK" register={register} error={errors.nip} placeholder="Nomor Induk Pegawai" icon={<Hash className="h-5 w-5 text-gray-400" />} />
          <FormField name="email" label="Email" type="email" register={register} error={errors.email} placeholder="Alamat email" icon={<Mail className="h-5 w-5 text-gray-400" />} />
          <FormField name="telepon" label="Telepon" type="tel" register={register} error={errors.telepon} placeholder="Nomor telepon" icon={<Phone className="h-5 w-5 text-gray-400" />} />
          <FormField name="tanggalLahir" label="Tanggal Lahir" type="date" register={register} error={errors.tanggalLahir} icon={<Calendar className="h-5 w-5 text-gray-400" />} />
          <div className="md:col-span-2">
            <FormField name="alamat" label="Alamat" as="textarea" register={register} error={errors.alamat} placeholder="Alamat lengkap" icon={<MapPin className="h-5 w-5 text-gray-400" />} />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileHeader;