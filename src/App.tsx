import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { MaintenancePage } from '@/Maintenance';
import LoginPage from '@/Login/LoginPage';
import { ApiKeyProvider } from "@/AI/contexts/ApiKeyContext.tsx";
import { RaportDataProvider } from "@/Raport";

// Lazy load page components
const DashboardPage = lazy(() => import('@/Dashboard/pages/DashboardPage'));
const GuruPage = lazy(() => import('@/Guru/pages/GuruPage'));
const ManajemenSiswaPage = lazy(() => import('@/Data_Siswa/pages/ManajemenSiswaPage'));
const PenilaianPage = lazy(() => import('@/Penilaian/pages/PenilaianPage.tsx'));
const RaportAiPage = lazy(() => import('@/Raport/pages/RaportAiPage'));
const BantuanPage = lazy(() => import('./Bantuan/pages/BantuanPage'));




// Komponen ProtectedRoute sederhana
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Komponen AdminRoute untuk melindungi rute admin-only
interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Komponen MaintenanceRoute untuk menangani halaman dalam maintenance
interface MaintenanceRouteProps {
  children: React.ReactNode;
  menuKey: string;
}

const MaintenanceRoute: React.FC<MaintenanceRouteProps> = ({ children, menuKey }) => {
  // Muat status maintenance dari localStorage atau default ke false
  const maintenanceStatus = localStorage.getItem('maintenanceStatus');
  let isUnderMaintenance = false;
  
  if (maintenanceStatus) {
    try {
      const parsedStatus = JSON.parse(maintenanceStatus);
      isUnderMaintenance = parsedStatus[menuKey] || false;
    } catch (e) {
      console.error('Gagal memuat status maintenance:', e);
      isUnderMaintenance = false;
    }
  }
  
  // Jika dalam maintenance, arahkan ke halaman maintenance
  if (isUnderMaintenance) {
    return <MaintenancePage menuKey={menuKey} />;
  }
  
  return children;
};

function App() {
  return (
    <ApiKeyProvider>
      <RaportDataProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
            <Routes>
              {/* Rute untuk halaman login */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Rute yang dilindungi dengan layout utama */}
              <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                {/* Dashboard utama */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={
                  <MaintenanceRoute menuKey="dashboard">
                    <DashboardPage />
                  </MaintenanceRoute>
                } />
                
                {/* Halaman Data Guru */}
                <Route path="/dashboard/guru" element={
                  <MaintenanceRoute menuKey="guru">
                    <GuruPage />
                  </MaintenanceRoute>
                } />
                
                {/* Halaman Manajemen Siswa */}
                <Route path="/dashboard/manajemen-siswa" element={
                  <MaintenanceRoute menuKey="manajemen-siswa">
                    <ManajemenSiswaPage />
                  </MaintenanceRoute>
                } />

                {/* Halaman Penilaian */}
                <Route path="/dashboard/penilaian" element={
                  <MaintenanceRoute menuKey="penilaian">
                    <PenilaianPage />
                  </MaintenanceRoute>
                } />
                
                {/* Halaman Raport AI */}
                <Route path="/dashboard/raport-ai" element={
                  <MaintenanceRoute menuKey="raport">
                    <RaportAiPage />
                  </MaintenanceRoute>
                } />
                
                {/* Halaman Bantuan */}
                <Route path="/dashboard/bantuan" element={
                  <MaintenanceRoute menuKey="bantuan">
                    <BantuanPage />
                  </MaintenanceRoute>
                } />
              </Route>
              
              {/* Rute fallback untuk halaman tidak ditemukan */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </RaportDataProvider>
    </ApiKeyProvider>
  );
}

export default App;