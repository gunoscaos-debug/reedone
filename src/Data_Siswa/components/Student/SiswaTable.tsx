import React from 'react';
import { Siswa } from '../../types/type';
import { Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import Button from '@/Komponen/Button';

interface SiswaTableProps {
  siswaList: Siswa[];
  onEdit: (siswa: Siswa) => void;
  onDelete: (id: string) => void;
  sortConfig: { key: keyof Siswa; direction: 'ascending' | 'descending' } | null;
  onSort: (key: keyof Siswa) => void;
  selectedSiswaIds: Set<string>;
  onSelectionChange: (id: string, isSelected: boolean) => void;
  onSelectAll: (areAllSelected: boolean) => void;
}

const SiswaTable: React.FC<SiswaTableProps> = ({ 
  siswaList, 
  onEdit,
  onDelete,
  sortConfig,
  onSort,
  selectedSiswaIds,
  onSelectionChange,
  onSelectAll
}) => {

  const getSortIcon = (key: keyof Siswa) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <div className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />; // Placeholder
    }
    if (sortConfig.direction === 'ascending') {
      return <ChevronUp className="w-4 h-4" />;
    }
    return <ChevronDown className="w-4 h-4" />;
  };

  const areAllOnPageSelected = siswaList.length > 0 && siswaList.every(s => selectedSiswaIds.has(s.id));

  const headerClasses = "px-4 py-3 text-left text-sm font-medium text-slate-600 uppercase tracking-wider";

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="py-3 pl-4 pr-3">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                checked={areAllOnPageSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
            <th 
              onClick={() => onSort('nama')} 
              scope="col" 
              className={`${headerClasses} cursor-pointer group hover:bg-slate-100`}
            >
              <div className="flex items-center gap-2">
                Nama {getSortIcon('nama')}
              </div>
            </th>
            <th 
              onClick={() => onSort('nisn')} 
              scope="col" 
              className={`${headerClasses} cursor-pointer group hover:bg-slate-100`}
            >
              <div className="flex items-center gap-2">
                NISN {getSortIcon('nisn')}
              </div>
            </th>
            <th 
              onClick={() => onSort('kelas')} 
              scope="col" 
              className={`${headerClasses} cursor-pointer group hover:bg-slate-100`}
            >
              <div className="flex items-center gap-2">
                Kelas {getSortIcon('kelas')}
              </div>
            </th>
            <th scope="col" className="relative py-3 pl-3 pr-4">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {siswaList.map((siswa) => (
            <tr 
              key={siswa.id} 
              className={`hover:bg-slate-50 ${selectedSiswaIds.has(siswa.id) ? 'bg-blue-50/50' : ''}`}>
              <td className="py-3 pl-4 pr-3">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedSiswaIds.has(siswa.id)}
                  onChange={(e) => onSelectionChange(siswa.id, e.target.checked)}
                />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                {siswa.nama}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                {siswa.nisn}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                {siswa.kelas}
              </td>
              <td className="relative whitespace-nowrap py-3 pl-3 pr-4 text-right text-sm font-medium">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(siswa)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(siswa.id)}
                  className="text-red-500 hover:text-red-600 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SiswaTable; 
