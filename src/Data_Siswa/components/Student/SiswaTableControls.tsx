import React from 'react';
import { Search, Trash2 } from 'lucide-react';
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
    <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-200">
      {/* Search */}
      <div className="w-full md:w-1/3 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Cari siswa..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center flex-wrap gap-2">
        <Button 
          variant="danger"
          onClick={onDeleteSelected}
          disabled={!hasSelection}
          size="sm"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus ({hasSelection ? '...' : 0})
        </Button>
      </div>
    </div>
  );
};

export default SiswaTableControls;
