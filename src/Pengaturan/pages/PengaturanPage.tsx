import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaExclamationTriangle, FaTachometerAlt, FaChalkboardTeacher, 
         FaUserGraduate, FaFileAlt, FaCogs } from 'react-icons/fa';
import toast from 'react-hot-toast';

type MaintenanceStatus = Record<string, boolean>;

const fetchMaintenanceStatus = async (): Promise<MaintenanceStatus> => {
  const savedStatus = localStorage.getItem('maintenanceStatus');
  if (savedStatus) {
    try {
      return JSON.parse(savedStatus);
    } catch (e) {
      console.error('Gagal memuat status maintenance', e);
    }
  }
  // Default status
  return { dashboard: false, guru: false, "manajemen-siswa": false, penilaian: false, raport: false, bantuan: false, pengaturan: false };
};

const saveMaintenanceStatus = async (status: MaintenanceStatus): Promise<MaintenanceStatus> => {
  localStorage.setItem('maintenanceStatus', JSON.stringify(status));
  return status;
};

export const PengaturanPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userRole = localStorage.getItem('userRole');

  const { data: maintenanceStatus, isLoading } = useQuery({
    queryKey: ['maintenanceSettings'],
    queryFn: fetchMaintenanceStatus,
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: saveMaintenanceStatus,
    onSuccess: (savedData) => {
      // Setelah berhasil disimpan, perbarui cache dengan data yang dikembalikan dari mutasi
      queryClient.setQueryData(['maintenanceSettings'], savedData);
      toast.success('Pengaturan disimpan!');
    },
    onError: (error, variables, context) => {
      // Jika gagal, kembalikan ke state sebelumnya (optimistic update rollback)
      if (context) {
        queryClient.setQueryData(['maintenanceSettings'], context);
      }
      toast.error('Gagal menyimpan. Perubahan dibatalkan.');
    },
  });

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/dashboard');
    }
  }, [userRole, navigate]);

  const handleMaintenanceToggle = (menuId: string) => {
    if (!maintenanceStatus) return;
    const newStatus = { ...maintenanceStatus, [menuId]: !maintenanceStatus[menuId] };
    // Panggil mutasi untuk menyimpan perubahan secara otomatis
    updateStatus(newStatus);
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: FaTachometerAlt },
    { id: 'guru', name: 'Data Guru', icon: FaChalkboardTeacher },
    { id: 'manajemen-siswa', name: 'Data Siswa', icon: FaUserGraduate },
    { id: 'penilaian', name: 'Penilaian', icon: FaFileAlt },
    { id: 'raport', name: 'Raport AI', icon: FaFileAlt },
    { id: 'bantuan', name: 'Bantuan', icon: FaCogs },
    { id: 'pengaturan', name: 'Pengaturan', icon: FaCogs },
  ];

  // Jika bukan admin atau data sedang loading, jangan tampilkan konten utama
  if (userRole !== 'admin' || isLoading || !maintenanceStatus) {
    return <div>Loading...</div>; // Atau tampilkan skeleton loader
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan</h1>
        <p className="text-slate-600 mt-2">
          Halaman khusus pengaturan sistem untuk administrator.
        </p>
      </div>

      {/* Kontrol Maintenance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="border-b border-gray-200 pb-5 mb-6">
          <h2 className="text-lg font-medium text-gray-900">Status Maintenance</h2>
          <p className="mt-1 text-sm text-gray-500">
            Atur status maintenance untuk setiap menu di sidebar
          </p>
        </div>
        
        <div className="space-y-4">
          {menuItems.map((menu) => {
            const IconComponent = menu.icon;
            return (
              <div 
                key={menu.id} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <IconComponent className="text-gray-600 mr-3" />
                  <span className="font-medium text-gray-800">{menu.name}</span>
                </div>
                
                <div className="flex items-center">
                  <span className={`mr-3 text-sm font-medium ${maintenanceStatus[menu.id] ? 'text-yellow-600' : 'text-green-600'}`}>
                    {maintenanceStatus[menu.id] ? 'Maintenance' : 'Aktif'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintenanceStatus[menu.id]}
                      onChange={() => handleMaintenanceToggle(menu.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex">
            <FaExclamationTriangle className="flex-shrink-0 text-blue-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Informasi</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>
                  Ketika status sebuah menu diubah menjadi "Maintenance", menu tersebut akan menampilkan halaman 
                  informasi maintenance dan tidak dapat diakses secara normal. Perubahan disimpan secara otomatis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};