import React from 'react';
import { useAI } from '../hooks/useAI';
import AISettings from '../components/AISettings';
import AIHistory from '../components/AIHistory';
import { Toaster } from 'react-hot-toast';

const AIManagementPage: React.FC = () => {
  const { analysisHistory, loading } = useAI();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen AI</h1>
        <p className="mt-1 text-gray-600">
          Kelola pengaturan dan riwayat analisis AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AISettings />
        <AIHistory history={analysisHistory} />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Informasi</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Layanan AI ini digunakan sebagai "jalur listrik" yang menghubungkan semua modul aplikasi. 
                Dengan satu titik koneksi ke AI, semua modul seperti Dashboard, Penilaian, Raport, dan Guru 
                dapat mengakses fungsi analisis AI secara konsisten.
              </p>
              <p className="mt-2">
                Untuk menggunakan fitur AI, masukkan API key yang valid dan klik tombol "Cek" untuk memverifikasi.
                Setelah diverifikasi, Anda dapat menyimpan pengaturan dengan tombol "Simpan Pengaturan".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIManagementPage;