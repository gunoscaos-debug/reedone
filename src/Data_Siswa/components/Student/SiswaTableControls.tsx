import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { LuSearch } from 'react-icons/lu';
import Button from '@/Komponen/Button';

interface SiswaTableControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
}

const SiswaTableControls: React.FC<SiswaTableControlsProps> = ({
  searchTerm,
  onSearchChange,
  onDeleteSelected,
  hasSelection,
}) => {
  return (
    <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
      {/* Search */}
      <div className="w-full md:w-1/3 relative">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari siswa..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center flex-wrap gap-2">
        <Button 
          variant="danger"
          onClick={onDeleteSelected}
          disabled={!hasSelection}
        >
          <FaTrash className="mr-2" /> Hapus Terpilih
        </Button>
      </div>
    </div>
  );
};

export default SiswaTableControls;