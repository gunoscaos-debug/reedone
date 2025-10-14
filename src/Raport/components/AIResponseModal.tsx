import React from 'react';
import { Siswa } from '@/type';

interface AIResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSiswa: Siswa | null;
  response: string;
  isLoading: boolean;
}

const AIResponseModal: React.FC<AIResponseModalProps> = ({ isOpen, onClose, selectedSiswa, response, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Respons AI untuk {selectedSiswa?.nama}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-slate-600">AI sedang berpikir...</p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none bg-slate-50 p-4 rounded-lg border border-slate-200">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {response || 'Tidak ada respons yang dihasilkan.'}
              </pre>
            </div>
          )}
          
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

export default AIResponseModal;