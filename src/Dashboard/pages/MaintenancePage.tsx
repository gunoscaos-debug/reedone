import React, { useEffect, useState } from 'react';
import { FaTools, FaExclamationTriangle, FaUserShield } from 'react-icons/fa';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type MaintenancePageProps = {};

const MaintenancePage: React.FC<MaintenancePageProps> = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Mendapatkan role user dari localStorage
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <FaTools className="text-6xl text-yellow-500" />
            <FaExclamationTriangle className="absolute -top-2 -right-2 text-red-500 text-2xl animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sedang Dalam Perbaikan</h1>
        <p className="text-gray-600 mb-6">
          Halaman ini saat ini sedang dalam perbaikan dan pengembangan. 
          Mohon maaf atas ketidaknyamanannya.
        </p>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Aplikasi lain tetap dapat diakses selama maintenance berlangsung.
              </p>
            </div>
          </div>
        </div>
        
        {/* Informasi khusus admin */}
        {userRole === 'admin' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <FaUserShield className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800">Informasi Admin</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Sebagai administrator, Anda dapat mengakses semua fitur lain selama maintenance berlangsung. 
                  Perbaikan sedang dilakukan untuk meningkatkan kinerja sistem.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-sm text-gray-500">
          <p>Jika Anda memiliki pertanyaan mendesak, silakan hubungi administrator sistem.</p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;