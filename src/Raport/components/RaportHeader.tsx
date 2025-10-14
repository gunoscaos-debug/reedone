import React, { useState } from 'react';
import { useRaportData } from '../contexts/useRaportData';
import { RaporHeaderData } from '@/type';

const RaportHeader: React.FC = () => {
  const { headerData, setHeaderData } = useRaportData();
  const [isEditing, setIsEditing] = useState(false);
  const [tempHeaderData, setTempHeaderData] = useState<RaporHeaderData>(headerData);

  const handleEdit = () => {
    setTempHeaderData(headerData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setHeaderData(tempHeaderData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempHeaderData(headerData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Edit Header Raport</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sekolah</label>
            <input
              type="text"
              value={tempHeaderData.namaSekolah}
              onChange={(e) => setTempHeaderData({...tempHeaderData, namaSekolah: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Sekolah</label>
            <input
              type="text"
              value={tempHeaderData.alamatSekolah}
              onChange={(e) => setTempHeaderData({...tempHeaderData, alamatSekolah: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wali Kelas</label>
            <input
              type="text"
              value={tempHeaderData.waliKelas}
              onChange={(e) => setTempHeaderData({...tempHeaderData, waliKelas: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NUPTK Wali Kelas</label>
            <input
              type="text"
              value={tempHeaderData.nuptkWaliKelas}
              onChange={(e) => setTempHeaderData({...tempHeaderData, nuptkWaliKelas: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select
              value={tempHeaderData.semester}
              onChange={(e) => setTempHeaderData({...tempHeaderData, semester: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Ajaran</label>
            <input
              type="text"
              value={tempHeaderData.tahunAjaran}
              onChange={(e) => setTempHeaderData({...tempHeaderData, tahunAjaran: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas/Fase</label>
            <input
              type="text"
              value={tempHeaderData.kelasFase}
              onChange={(e) => setTempHeaderData({...tempHeaderData, kelasFase: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bidang Keahlian</label>
            <input
              type="text"
              value={tempHeaderData.bidangKeahlian}
              onChange={(e) => setTempHeaderData({...tempHeaderData, bidangKeahlian: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Keahlian</label>
            <input
              type="text"
              value={tempHeaderData.programKeahlian}
              onChange={(e) => setTempHeaderData({...tempHeaderData, programKeahlian: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-center">{headerData.reportTitle}</h1>
          <div className="mt-4 text-center">
            <p className="font-semibold">{headerData.namaSekolah}</p>
            <p>{headerData.alamatSekolah}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p><span className="font-semibold">Wali Kelas:</span> {headerData.waliKelas}</p>
              <p><span className="font-semibold">NUPTK:</span> {headerData.nuptkWaliKelas}</p>
            </div>
            <div>
              <p><span className="font-semibold">Semester:</span> {headerData.semester}</p>
              <p><span className="font-semibold">Tahun Ajaran:</span> {headerData.tahunAjaran}</p>
              <p><span className="font-semibold">Kelas/Fase:</span> {headerData.kelasFase}</p>
            </div>
            <div>
              <p><span className="font-semibold">Bidang Keahlian:</span> {headerData.bidangKeahlian}</p>
              <p><span className="font-semibold">Program Keahlian:</span> {headerData.programKeahlian}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleEdit}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default RaportHeader;