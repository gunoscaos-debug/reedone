import React, { useState, useRef, useCallback } from 'react';
import Button from '@/Komponen/Button';
import toast, { Toaster } from 'react-hot-toast';
import ProfileHeader from '../components/ProfileHeader';
import PageHeader from '@/Komponen/PageHeader'; // Impor komponen baru
import JadwalPelajaran from '../components/JadwalPelajaran';
import { useGuruData } from '../hooks/useGuruData';
import { Camera, Mail, Phone, User, Edit, Image as ImageIcon } from 'lucide-react';
import type { GuruProfile } from '@/data/database';
import { useImageCrop, getCroppedImg } from '../hooks/useImageCrop';
import { CropImageModal } from '../components/CropImageModal';
import { PixelCrop } from 'react-image-crop';

const GuruPage: React.FC = () => {
  const { profile, profileLoading, scheduleLoading, isUpdating, updateProfile } = useGuruData();
  const [isEditing, setIsEditing] = useState(false);

  const profileImageCrop = useImageCrop();
  const bgImageCrop = useImageCrop();

  const profileImgRef = useRef<HTMLImageElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileImageSave = async (crop: PixelCrop) => {
    if (profileImgRef.current) {
      const croppedImageUrl = await getCroppedImg(profileImgRef.current, crop);
      await updateProfile({ foto: croppedImageUrl });
      profileImageCrop.reset();
      toast.success('Foto profil berhasil diperbarui');
    }
  };

  const handleBgImageSave = async (crop: PixelCrop) => {
    if (bgImgRef.current) {
      const croppedImageUrl = await getCroppedImg(bgImgRef.current, crop);
      await updateProfile({ fotoLatar: croppedImageUrl });
      bgImageCrop.reset();
      toast.success('Foto latar berhasil diperbarui');
    }
  };

  const handleSaveProfile = useCallback(async (updatedData: Partial<GuruProfile>) => {
    try {
      await updateProfile(updatedData);
      toast.success('Profil berhasil diperbarui');
      setIsEditing(false);
    } catch (error) {
      console.error('Gagal menyimpan profil:', error);
      toast.error('Gagal menyimpan profil.');
    }
  }, [updateProfile]);

  return (
    <div className="p-4 sm:p-6">
      <Toaster position="top-right" />
      
      <PageHeader 
        title="Profil Guru"
        subtitle="Kelola informasi dan detail profil Anda."
      />

      {profileLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : profile ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
              <div className="relative">
                {/* Background/Cover Photo */}
                <div className="h-40 bg-gradient-to-r from-primary-500 to-blue-500 group">
                  {profile.fotoLatar && (
                    <img src={profile.fotoLatar} alt="Latar Belakang Profil" className="w-full h-full object-cover" />
                  )}
                  <button
                    onClick={() => bgFileInputRef.current?.click()}
                    className="absolute top-3 right-3 bg-black/30 text-white rounded-full p-2 shadow-md hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Ubah foto latar"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </button>
                  <input
                    type="file"
                    ref={bgFileInputRef}
                    onChange={bgImageCrop.onFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Profile Picture */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    {profile.foto ? (
                      <img 
                        src={profile.foto} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center border-4 border-white shadow-lg">
                        <User className="w-16 h-16 text-slate-400" />
                      </div>
                    )}
                    
                    <button
                      onClick={() => profileFileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 bg-primary-600 text-white rounded-full p-2 shadow-md hover:bg-primary-700 transition-colors"
                      aria-label="Ubah foto profil"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-20 p-6 text-center">
                <input
                  type="file" 
                  ref={profileFileInputRef}
                  onChange={profileImageCrop.onFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <h2 className="text-xl font-semibold mt-4 text-slate-800">{profile.nama || 'Nama Guru'}</h2>
                <p className="text-slate-600">{profile.mataPelajaran || 'Mata Pelajaran'}</p>
                <div className="mt-4 w-full">
                  <Button 
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? 'secondary' : 'primary'}
                    fullWidth
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {isEditing ? 'Batal Edit' : 'Edit Profil'}
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="font-medium text-slate-800 mb-3">Informasi Kontak</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{profile.email || 'Belum diisi'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{profile.telepon || 'Belum diisi'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <ProfileHeader profile={profile} onSave={handleSaveProfile} isEditing={isEditing} />
            <JadwalPelajaran kelasOptions={profile.kelas || []} isLoading={scheduleLoading} />
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-slate-500">Gagal memuat data profil guru atau profil belum dibuat.</p>
          <Button onClick={() => handleSaveProfile({})} className="mt-4" disabled={isUpdating}>
            Buat Profil Guru
          </Button>
        </div>
      )}

      {profileImageCrop.image && (
        <CropImageModal
          isOpen={profileImageCrop.showModal}
          onClose={profileImageCrop.reset}
          onConfirm={handleProfileImageSave}
          image={profileImageCrop.image}
          crop={profileImageCrop.crop}
          ref={profileImgRef}
          completedCrop={profileImageCrop.completedCrop}
          setCrop={profileImageCrop.setCrop}
          setCompletedCrop={profileImageCrop.setCompletedCrop}
          title="Potong Foto Profil"
        />
      )}

      {bgImageCrop.image && (
        <CropImageModal
          isOpen={bgImageCrop.showModal}
          onClose={bgImageCrop.reset}
          onConfirm={handleBgImageSave}
          image={bgImageCrop.image}
          crop={bgImageCrop.crop}
          ref={bgImgRef}
          completedCrop={bgImageCrop.completedCrop}
          setCrop={bgImageCrop.setCrop}
          setCompletedCrop={bgImageCrop.setCompletedCrop}
          aspect={16 / 6}
          title="Potong Foto Latar"
        />
      )}
    </div>
  );
};

export default GuruPage;