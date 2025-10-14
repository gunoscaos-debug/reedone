import React from 'react';
import { FaUserGraduate, FaBook, FaChartBar } from 'react-icons/fa';
import { Siswa } from '@/type';
import Chart from '../Chart/Chart';

interface Grades {
  [studentId: string]: {
    [subjectId: string]: {
      nh_ganjil: number | null;
      sts_ganjil: number | null;
      sas_ganjil: number | null;
      nh_genap: number | null;
      sts_genap: number | null;
      sas_genap: number | null;
    }
  };
}

interface DashboardProps {
  studentCount: number;
  subjectCount: number;
  averageGrade: number;
  students: Siswa[];
  subjects: { id: string; name: string }[];
  grades: Grades;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  studentCount,
  subjectCount,
  averageGrade,
  students,
  subjects,
  grades
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
              <FaUserGraduate className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Siswa</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300">
              <FaBook className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Mata Pelajaran</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{subjectCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300">
              <FaChartBar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rata-rata Nilai</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageGrade.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Statistik Nilai Terbaru</h3>
        <Chart students={students} subjects={subjects} grades={grades} />
      </div>
    </div>
  );
};

export default Dashboard;