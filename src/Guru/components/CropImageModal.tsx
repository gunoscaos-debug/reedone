import React, { useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Button from '@/Komponen/Button';

interface CropImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (crop: PixelCrop) => void;
  image: string;
  crop: Crop | undefined;
  setCrop: (crop: Crop) => void;
  setCompletedCrop: (crop: PixelCrop) => void;
  aspect?: number;
  title: string;
}

export const CropImageModal: React.FC<CropImageModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  image, 
  crop, 
  setCrop, 
  setCompletedCrop, 
  aspect = 1, 
  title 
}) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleConfirm = () => {
    if (imgRef.current && completedCrop) {
      onConfirm(completedCrop);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-soft p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">{title}</h3>
        <div className="flex justify-center">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            circularCrop={aspect === 1}
          >
            <img ref={imgRef} alt="Crop me" src={image} />
          </ReactCrop>
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <Button onClick={onClose} variant="outline">
            Batal
          </Button>
          <Button onClick={handleConfirm}>
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
};