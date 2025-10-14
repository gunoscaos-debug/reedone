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
      return null;
    }
    if (sortConfig.direction === 'ascending') {
      return <ChevronUp className="w-4 h-4 ml-1" />;
    }
    return <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const areAllOnPageSelected = siswaList.length > 0 && siswaList.every(s => selectedSiswaIds.has(s.id));

  return (
    <div className="overflow-x-auto">
      <div className="p-1.5 min-w-full inline-block align-middle">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="py-3 pl-4">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={areAllOnPageSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              <th onClick={() => onSort('nama')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer flex items-center">
                Nama {getSortIcon('nama')}
              </th>
              <th onClick={() => onSort('nisn')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer flex items-center">
                NISN {getSortIcon('nisn')}
              </th>
              <th onClick={() => onSort('kelas')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer flex items-center">
                Kelas {getSortIcon('kelas')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {siswaList.map((siswa) => (
              <tr key={siswa.id} className={`${selectedSiswaIds.has(siswa.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                <td className="py-4 pl-4">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-5 w-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={selectedSiswaIds.has(siswa.id)}
                    onChange={(e) => onSelectionChange(siswa.id, e.target.checked)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {siswa.nama}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {siswa.nisn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {siswa.kelas}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(siswa)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(siswa.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SiswaTable;