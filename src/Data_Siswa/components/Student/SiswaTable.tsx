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
      return <div className="w-4 h-4" />; // Placeholder for alignment
    }
    if (sortConfig.direction === 'ascending') {
      return <ChevronUp className="w-4 h-4" />;
    }
    return <ChevronDown className="w-4 h-4" />;
  };

  const areAllOnPageSelected = siswaList.length > 0 && siswaList.every(s => selectedSiswaIds.has(s.id));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50/50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={areAllOnPageSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
            <th 
              onClick={() => onSort('nama')} 
              scope="col" 
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-1">
                Nama {getSortIcon('nama')}
              </div>
            </th>
            <th 
              onClick={() => onSort('nisn')} 
              scope="col" 
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-1">
                NISN {getSortIcon('nisn')}
              </div>
            </th>
            <th 
              onClick={() => onSort('kelas')} 
              scope="col" 
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-1">
                Kelas {getSortIcon('kelas')}
              </div>
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {siswaList.map((siswa) => (
            <tr 
              key={siswa.id} 
              className={`hover:bg-gray-50 ${selectedSiswaIds.has(siswa.id) ? 'bg-blue-50' : ''}`}>
              <td className="py-4 pl-4 pr-3 text-sm">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedSiswaIds.has(siswa.id)}
                  onChange={(e) => onSelectionChange(siswa.id, e.target.checked)}
                />
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                {siswa.nama}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {siswa.nisn}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {siswa.kelas}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(siswa)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(siswa.id)}
                  className="text-red-600 hover:text-red-900 ml-2"
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