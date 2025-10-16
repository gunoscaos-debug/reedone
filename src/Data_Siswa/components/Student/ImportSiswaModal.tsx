import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import Button from '@/Komponen/Button';
import { Siswa } from '@/Data_Siswa/types/type';
import { X, UploadCloud, FileText, AlertTriangle, Download } from 'lucide-react';

interface ImportSiswaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: Omit<Siswa, 'id'>[]) => void;
  onDownloadTemplate: () => void;
}

const ImportSiswaModal: React.FC<ImportSiswaModalProps> = ({ isOpen, onClose, onImport, onDownloadTemplate }) => {
  const [parsedData, setParsedData] = useState<Omit<Siswa, 'id'>[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      setError('File tidak valid.');
      return;
    }

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target?.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

        // Validate and map data
        const requiredFields = ['nama', 'nisn', 'kelas'];
        const firstRow = jsonData[0] || {};
        const hasAllFields = requiredFields.every(field => Object.keys(firstRow).includes(field));

        if (!hasAllFields) {
          setError(`File harus memiliki kolom: ${requiredFields.join(', ')}.`);
          setParsedData([]);
          return;
        }

        const mappedData: Omit<Siswa, 'id'>[] = jsonData.map(row => ({
          nama: row.nama,
          nisn: String(row.nisn),
          kelas: row.kelas,
          // Optional fields
          gender: row.gender,
          tempat_lahir: row.tempat_lahir,
          tanggal_lahir: row.tanggal_lahir,
          alamat: row.alamat,
        }));

        setParsedData(mappedData);
      } catch (e) {
        setError('Gagal memproses file. Pastikan formatnya benar.');
        setParsedData([]);
      }
    };
    reader.readAsBinaryString(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const handleImportClick = () => {
    if (parsedData.length > 0) {
      onImport(parsedData);
      onClose();
      // Reset state after import
      setParsedData([]);
      setFileName(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Import Data Siswa</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Dropzone */}
          <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors 
            ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <UploadCloud className="w-12 h-12 mb-4" />
              {isDragActive ?
                <p className="text-lg font-semibold">Lepaskan file di sini...</p> :
                <p className="text-lg font-semibold">Seret & lepas file Excel/CSV di sini, atau klik untuk memilih</p>
              }
              <p className="text-sm">Format yang didukung: .xlsx, .csv</p>
            </div>
          </div>

          <div className="text-center mt-4">
            <Button
              type="button"
              variant="link"
              onClick={onDownloadTemplate}
              className="text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Tidak punya template? Unduh di sini.
            </Button>
          </div>

          {/* File Info & Error */}
          {fileName && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                <span className="font-medium">{fileName}</span>
              </div>
              <span className="text-sm text-gray-500">{parsedData.length} baris data ditemukan</span>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          {/* Preview Table */}
          {parsedData.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold mb-2">Pratinjau Data:</h3>
              <div className="overflow-y-auto max-h-60 border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/80 sticky top-0">
                    <tr>
                      {Object.keys(parsedData[0]).map(key => (
                        <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {parsedData.slice(0, 10).map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedData.length > 10 && <p className="text-xs text-center mt-2 text-gray-500">Menampilkan 10 baris pertama dari {parsedData.length} total.</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center space-x-3">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button 
            onClick={handleImportClick} 
            disabled={parsedData.length === 0 || !!error}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Import {parsedData.length > 0 ? `${parsedData.length} Siswa` : ''}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportSiswaModal;
