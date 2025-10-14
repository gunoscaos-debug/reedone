import React from 'react';
import { FaTrash, FaUsersCog } from 'react-icons/fa';
import { LuSearch } from 'react-icons/lu';
import Button from '@/Komponen/Button';

interface SiswaTableControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onManageKelasClick: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
}

const SiswaTableControls: React.FC<SiswaTableControlsProps> = ({
  searchTerm,
  onSearchChange,
  onDeleteSelected,
  hasSelection,
  onManageKelasClick,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-grow relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari siswa..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={onManageKelasClick}
          >
            <FaUsersCog className="mr-2" /> Manajemen Kelas
          </Button>
          <Button 
            variant="danger"
            onClick={onDeleteSelected}
            disabled={!hasSelection}
          >
            <FaTrash className="mr-2" /> Hapus Terpilih
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SiswaTableControls;