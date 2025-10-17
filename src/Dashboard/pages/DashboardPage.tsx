import React from 'react';
import { Users, Book, TriangleAlert } from 'lucide-react';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import GrafikSiswa from '../components/GrafikSiswa';
import PenilaianWidget from '../components/PenilaianWidget'; // Impor widget baru
import { useDashboardData } from '../hooks/useDashboardData';
import { useSiswa } from '@/Data_Siswa/hooks/useSiswa';
import { usePenilaianData } from '@/Penilaian/hooks/usePenilaianData';
import PageHeader from '@/Komponen/PageHeader';

const DashboardPage: React.FC = () => {
  const { stats: dashboardStats, activities, loading: loadingDashboard, error: errorDashboard } = useDashboardData();
  const { siswaList, loading: loadingSiswa, error: errorSiswa } = useSiswa();
  const { stats: penilaianStats, loading: loadingPenilaian, error: errorPenilaian } = usePenilaianData();

  const isLoading = loadingDashboard || loadingSiswa || loadingPenilaian;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Error utama dari dashboard data tetap ditampilkan secara penuh
  if (errorDashboard) {
    // ... (error handling tidak berubah)
  }

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <PageHeader 
        title="Dashboard"
        subtitle="Selamat datang di Sistem Manajemen Sekolah"
      />

      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Total Siswa" 
            value={dashboardStats.totalStudents} 
            icon={<Users className="h-8 w-8 text-blue-600" />} 
            color="bg-blue-100" 
          />
          <StatCard 
            title="Total Kelas" 
            value={dashboardStats.totalClasses} 
            icon={<Book className="h-8 w-8 text-amber-600" />} 
            color="bg-amber-100" 
          />
          {/* Widget Penilaian dengan penanganan error lokal */}
          {errorPenilaian ? (
            <div className="bg-white rounded-xl shadow-soft p-6 flex flex-col items-center justify-center text-amber-600 border border-amber-200">
              <TriangleAlert className="h-8 w-8 mb-2" />
              <p className="text-sm font-semibold">Gagal Muat Nilai</p>
            </div>
          ) : (
            <PenilaianWidget stats={penilaianStats} isLoading={loadingPenilaian} />
          )}
        </div>

        {/* Grafik Siswa dengan Penanganan Error Lokal */}
        {errorSiswa ? (
          <div className="bg-white rounded-xl shadow-soft p-6 flex flex-col items-center justify-center h-80 text-amber-600 border border-amber-200">
            <TriangleAlert className="h-10 w-10 mb-4" />
            <h3 className="font-semibold">Gagal Memuat Grafik Siswa</h3>
            <p className="text-sm text-slate-500">Data siswa tidak dapat diambil saat ini.</p>
          </div>
        ) : (
          <GrafikSiswa siswaList={siswaList} isLoading={loadingSiswa} />
        )}

        {/* Recent Activity */}
        {errorDashboard ? (
           <div className="bg-white rounded-xl shadow-soft p-6 flex flex-col items-center justify-center h-80 text-amber-600 border border-amber-200">
            <TriangleAlert className="h-10 w-10 mb-4" />
            <h3 className="font-semibold">Gagal Memuat Aktivitas</h3>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Aktivitas Terbaru</h2>
            <RecentActivity activities={activities} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
