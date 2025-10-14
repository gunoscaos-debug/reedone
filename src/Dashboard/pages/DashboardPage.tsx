import React from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaFileAlt, FaRobot, FaBook, FaChartBar, FaUserCog } from 'react-icons/fa';
import StatCard from '../components/StatCard';
import QuickAction from '../components/QuickAction';
import RecentActivity from '../components/RecentActivity';
import { useDashboardData } from '../hooks/useDashboardData';

const DashboardPage: React.FC = () => {
  const { stats, activities, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Selamat datang di Sistem Manajemen Sekolah
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Siswa" 
          value={stats.totalStudents} 
          icon={<FaUserGraduate className="h-6 w-6" />} 
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
        />
        <StatCard 
          title="Total Kelas" 
          value={stats.totalClasses} 
          icon={<FaBook className="h-6 w-6" />} 
          color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" 
        />
        <StatCard 
          title="Total Mata Pelajaran" 
          value={stats.totalSubjects} 
          icon={<FaFileAlt className="h-6 w-6" />} 
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" 
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAction 
            title="Penilaian" 
            description="Kelola nilai siswa" 
            icon={<FaChartBar className="h-6 w-6" />} 
            path="/penilaian" 
            color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
          />
          <QuickAction 
            title="Profil Guru" 
            description="Kelola profil dan informasi guru" 
            icon={<FaChalkboardTeacher className="h-6 w-6" />} 
            path="/guru" 
            color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
          />
          <QuickAction 
            title="Raport" 
            description="Buat dan kelola raport siswa" 
            icon={<FaFileAlt className="h-6 w-6" />} 
            path="/raport" 
            color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" 
          />
          <QuickAction 
            title="Analisis AI" 
            description="Gunakan AI untuk analisis pembelajaran" 
            icon={<FaRobot className="h-6 w-6" />} 
            path="/raport-ai" 
            color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" 
          />
          <QuickAction 
            title="Data Siswa" 
            description="Kelola data dan informasi siswa" 
            icon={<FaUserGraduate className="h-6 w-6" />} 
            path="/siswa" 
            color="bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" 
          />
          <QuickAction 
            title="Pengaturan" 
            description="Kelola pengaturan sistem" 
            icon={<FaUserCog className="h-6 w-6" />} 
            path="/pengaturan" 
            color="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" 
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Aktivitas Terbaru</h2>
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
};

export default DashboardPage;