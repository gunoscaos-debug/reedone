import React, { useState } from 'react';
import { Kelas } from '../../types/type';
import Button from '@/Komponen/Button';
import { X } from 'lucide-react';

interface ClassManagerProps {
  isOpen: boolean;
  onClose: () => void;
  kelasList: Kelas[];
  onAddKelas: (nama: string) => void;
  onDeleteKelas: (id: string) => void;
}

const ClassManager: React.FC<ClassManagerProps> = ({ isOpen, onClose, kelasList, onAddKelas, onDeleteKelas }) => {
  const [newClassName, setNewClassName] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleAdd = () => {
    if (newClassName.trim()) {
      onAddKelas(newClassName.trim().toUpperCase());
      setNewClassName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">🏢 Manajemen Kelas</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1 h-auto">
            <X />
          </Button>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            className="input-field flex-grow"
            placeholder="Contoh: X-TJKT"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd}>Tambah</Button>
        </div>
        <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1">
          {kelasList.map(k => (
            <div key={k.id} className="flex items-center bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium px-3 py-1 rounded-full">
              {k.nama}
              <button
                onClick={() => onDeleteKelas(k.id)}
                className="ml-2 text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </div>
  );
};

export default ClassManager;