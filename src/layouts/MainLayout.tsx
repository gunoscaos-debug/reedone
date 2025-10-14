import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { FaBars } from 'react-icons/fa';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar untuk Desktop */}
      <div className={`hidden md:flex md:flex-shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}>
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggleCollapse={toggleSidebarCollapse}
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>

      {/* Konten Utama */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Tombol Menu Mobile */}
        {!isSidebarOpen && (
          <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Menu</h1>
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
              <FaBars size={20} />
            </button>
          </header>
        )}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar untuk Mobile (Overlay) */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative h-full">
            <Sidebar isCollapsed={false} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;