import React from 'react';
import { FaUserGraduate, FaBook, FaBookOpen, FaExclamationTriangle } from 'react-icons/fa';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import { useDashboardData } from '../hooks/useDashboardData';

// --- Data Definitions for Cleaner Rendering ---

const getStatCards = (stats: { totalStudents: number; totalClasses: number; totalSubjects: number; }) => [
  { 
    title: "Total Siswa", 
    value: stats.totalStudents, 
    icon: <FaUserGraduate className="h-8 w-8 text-blue-600" />,
    color: "bg-blue-100"
  },
  { 
    title: "Total Kelas", 
    value: stats.totalClasses, 
    icon: <FaBook className="h-8 w-8 text-amber-600" />,
    color: "bg-amber-100"
  },
  { 
    title: "Total Mata Pelajaran", 
    value: stats.totalSubjects, 
    icon: <FaBookOpen className="h-8 w-8 text-purple-600" />,
    color: "bg-purple-100"
  },
];

const DashboardPage: React.FC = () => {
  const { stats, activities, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500 bg-red-50 border border-red-200 rounded-lg p-6">
        <FaExclamationTriangle className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-bold mb-2">Gagal Memuat Data</h2>
        <p className="text-center">Terjadi kesalahan saat memuat data dashboard. Silakan coba lagi nanti.</p>
        <p className="mt-2 text-sm text-gray-500">Detail: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-black">Dashboard</h1>
        <p className="mt-1 text-slate-700">
          Selamat datang di Sistem Manajemen Sekolah
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getStatCards(stats).map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-black mb-4">Aktivitas Terbaru</h2>
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
};

export default DashboardPage;