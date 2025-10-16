import React, { useState, useRef, useCallback } from 'react';
import Button from '@/Komponen/Button';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import toast, { Toaster } from 'react-hot-toast';
import ProfileHeader from './components/ProfileHeader';
import ProfileDetails from './components/ProfileDetails';
import { useGuruData } from './hooks/useGuruData';
import { Camera, Mail, Phone, User, Edit, Image as ImageIcon } from 'lucide-react';
import { GuruProfile } from './database';

const GuruPage: React.FC = () => {
  const { profile, loading, updateProfile } = useGuruData();
  // State untuk foto profil
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showCropModal, setShowCropModal] = useState(false);
  // State untuk foto latar
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgCrop, setBgCrop] = useState<Crop>();
  const [completedBgCrop, setCompletedBgCrop] = useState<PixelCrop>();
  const [showBgCropModal, setShowBgCropModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
        setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleBgImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBgImage(reader.result as string);
        setBgCrop({ unit: '%', width: 100, height: 50, x: 0, y: 25 });
        setShowBgCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCropConfirm = useCallback(async () => {
    if (imgRef.current && completedCrop?.width && completedCrop?.height) {
      const croppedImg = await getCroppedImg(
        imgRef.current,
        completedCrop
      );
      await updateProfile({ foto: croppedImg });
      setShowCropModal(false);
      toast.success('Foto profil berhasil diperbarui');
    }
  }, [completedCrop, updateProfile]);

  const handleBgCropConfirm = useCallback(async () => {
    if (bgImgRef.current && completedBgCrop?.width && completedBgCrop?.height) {
      const croppedImg = await getCroppedImg(
        bgImgRef.current,
        completedBgCrop
      );
      await updateProfile({ fotoLatar: croppedImg });
      setShowBgCropModal(false);
      toast.success('Foto latar berhasil diperbarui');
    }
  }, [completedBgCrop, updateProfile]);

  const handleSaveProfile = useCallback(async (updatedData: Partial<GuruProfile>) => {
    await updateProfile(updatedData);
    toast.success('Profil berhasil diperbarui');
    setIsEditing(false);
  }, [updateProfile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">Gagal memuat data profil guru.</p>
      </div>
    );
  }

  const cancelCrop = () => {
    setShowCropModal(false);
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const cancelBgCrop = () => {
    setShowBgCropModal(false);
    setBgImage(null);
    if (bgFileInputRef.current) {
      bgFileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Toaster position="top-right" />
      
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Profil Guru</h1>
        <p className="mt-1 text-slate-600">Kelola informasi dan detail profil Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <div className="relative">
              {/* Background/Cover Photo */}
              <div className="h-40 bg-gradient-to-r from-primary-500 to-blue-500 group">
                {profile.fotoLatar ? (
                  <img src={profile.fotoLatar} alt="Latar Belakang Profil" className="w-full h-full object-cover" />
                ) : null}
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
                  onChange={handleBgImageUpload}
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
                    onClick={() => fileInputRef.current?.click()}
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
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <h2 className="text-xl font-semibold mt-4 text-slate-800">{profile.nama || 'Nama Guru'}</h2>
              <p className="text-slate-600">{profile.mataPelajaran || 'Mata Pelajaran'}</p>
              
              <div className="mt-4 w-full">
                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  variant="primary"
                  fullWidth
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {isEditing ? 'Batal Edit' : 'Edit Profil'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-soft p-6 mt-6">
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
          <ProfileDetails profile={profile} onSave={handleSaveProfile} isEditing={isEditing} />
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-soft p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Potong Foto Profil</h3>
            <div className="flex justify-center">
              {profileImage && (
                <ReactCrop                  
                  crop={crop}                  
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}                  
                  circularCrop                  
                  aspect={1}                
                >
                  <img ref={imgRef} alt="Crop me" src={profileImage} />
                </ReactCrop>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                onClick={cancelCrop}
                variant="outline"
              >
                Batal
              </Button>
              <Button onClick={handleCropConfirm}>
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Background Crop Modal */}
      {showBgCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-soft p-6 max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Potong Foto Latar</h3>
            <div className="flex justify-center">
              {bgImage && (
                <ReactCrop
                  crop={bgCrop}
                  onChange={(_, percentCrop) => setBgCrop(percentCrop)}
                  onComplete={(c) => setCompletedBgCrop(c)}
                  aspect={16 / 6}
                >
                  <img ref={bgImgRef} alt="Crop me" src={bgImage} style={{ maxHeight: '70vh' }} />
                </ReactCrop>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <Button onClick={cancelBgCrop} variant="outline">Batal</Button>
              <Button onClick={handleBgCropConfirm}>Simpan</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fungsi utilitas untuk cropping gambar
function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<string> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  canvas.width = crop.width;
  canvas.height = crop.height;
  
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.reject(new Error('Tidak dapat membuat konteks canvas 2D'));
  }

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    resolve(canvas.toDataURL('image/jpeg'));
  });
}

export default GuruPage;