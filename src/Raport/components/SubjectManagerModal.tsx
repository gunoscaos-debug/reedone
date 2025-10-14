import React, { useState } from 'react';
import { useRaportData } from '../contexts/useRaportData';
import { MapelData } from '@/type';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface SubjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubjectManagerModal: React.FC<SubjectManagerModalProps> = ({ isOpen, onClose }) => {
  const { subjects, setSubjects } = useRaportData();
  const [newSubject, setNewSubject] = useState<Omit<MapelData, 'id'>>({ nama: '', kkm: 75 });

  const handleAddSubject = () => {
    if (newSubject.nama.trim() === '') return;
    
    const subjectWithId: MapelData = {
      ...newSubject,
      id: `mapel-${Date.now()}`
    };
    
    setSubjects(prev => [...prev, subjectWithId]);
    setNewSubject({ nama: '', kkm: 75 });
    toast.success('Mata pelajaran berhasil ditambahkan!');
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
    toast.success('Mata pelajaran berhasil dihapus!');
  };

  const handleKKMChange = (id: string, kkm: number) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === id ? { ...subject, kkm } : subject
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Manajemen Mata Pelajaran</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Tambah Mata Pelajaran</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubject.nama}
                onChange={(e) => setNewSubject({...newSubject, nama: e.target.value})}
                placeholder="Nama mata pelajaran"
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                value={newSubject.kkm}
                onChange={(e) => setNewSubject({...newSubject, kkm: Number(e.target.value)})}
                placeholder="KKM"
                min="0"
                max="100"
                className="w-24 p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleAddSubject}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="mr-2" /> Tambah
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Daftar Mata Pelajaran</h3>
            {subjects.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Belum ada mata pelajaran</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Nama Mata Pelajaran</th>
                      <th className="border p-2 text-center">KKM</th>
                      <th className="border p-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <tr key={subject.id}>
                        <td className="border p-2">{subject.nama}</td>
                        <td className="border p-2">
                          <input
                            type="number"
                            value={subject.kkm}
                            onChange={(e) => handleKKMChange(subject.id, Number(e.target.value))}
                            className="w-full p-1 border border-gray-300 rounded text-center"
                            min="0"
                            max="100"
                          />
                        </td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => handleDeleteSubject(subject.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectManagerModal;