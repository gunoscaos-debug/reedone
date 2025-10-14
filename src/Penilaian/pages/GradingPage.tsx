import React, { useState, useEffect } from 'react';
import { useSiswa } from './hooks/useSiswa';
import { useSiswaPagination } from './hooks/useSiswaPagination';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const PenilaianPage: React.FC = () => {
  const { siswa: allSiswa, loading, error } = useSiswa();
  const [currentSiswaIndex, setCurrentSiswaIndex] = useState(0);
  const { 
    currentPage, 
    totalPages, 
    paginatedSiswa, 
    setCurrentPage 
  } = useSiswaPagination(allSiswa || [], 10); // Memberikan default array kosong jika allSiswa undefined
  
  const nilaiSchema = z.object({
    nh_ganjil: z.string().optional(),
    sts_ganjil: z.string().optional(),
    sas_ganjil: z.string().optional(),
    nh_genap: z.string().optional(),
    sts_genap: z.string().optional(),
    sas_genap: z.string().optional(),
    catatan_baik: z.string().optional(),
    catatan_buruk: z.string().optional(),
  });

  type NilaiFormValues = z.infer<typeof nilaiSchema>;

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<NilaiFormValues>({
    resolver: zodResolver(nilaiSchema),
  });

  // Update nilai ketika siswa berubah
  useEffect(() => {
    if (paginatedSiswa && paginatedSiswa.length > 0 && currentSiswaIndex < paginatedSiswa.length) {
      const siswa = paginatedSiswa[currentSiswaIndex];
      reset({
        nh_ganjil: siswa.nh_ganjil || '',
        sts_ganjil: siswa.sts_ganjil || '',
        sas_ganjil: siswa.sas_ganjil || '',
        nh_genap: siswa.nh_genap || '',
        sts_genap: siswa.sts_genap || '',
        sas_genap: siswa.sas_genap || '',
        catatan_baik: siswa.catatan_baik || '',
        catatan_buruk: siswa.catatan_buruk || '',
      });
    }
  }, [currentSiswaIndex, paginatedSiswa, reset]);

  const currentSiswa = paginatedSiswa && paginatedSiswa.length > 0 ? paginatedSiswa[currentSiswaIndex] : null;

  const handleNext = () => {
    if (paginatedSiswa && currentSiswaIndex < paginatedSiswa.length - 1) { //NOSONAR
      setCurrentSiswaIndex(currentSiswaIndex + 1);
    } else if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setCurrentSiswaIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentSiswaIndex > 0) {
      setCurrentSiswaIndex(currentSiswaIndex - 1);
    } else if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      if (paginatedSiswa) {
        setCurrentSiswaIndex(paginatedSiswa.length - 1);
      }
    }
  };

  const handleSave = (data: NilaiFormValues) => {
    // Simpan nilai siswa
    console.log('Menyimpan nilai:', { ...data, id: currentSiswa?.id });
    alert(`Nilai untuk ${currentSiswa?.nama} telah disimpan!`);
  };

  if (loading) {
    return <div className="text-center py-10">Memuat data siswa...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit(handleSave)} className="bg-white/95 backdrop-blur-sm p-6 sm:p-10 rounded-xl shadow-lg">
        <header className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">📝 Penilaian Siswa</h2>
        </header>

        {currentSiswa ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0 text-center w-full lg:w-64 mx-auto lg:sticky lg:top-8 lg:self-start">
              <h2 
                id="nama-siswa-penilaian" 
                className="text-sm font-bold text-gray-800 mb-2 border border-gray-300 rounded-lg p-2 text-center bg-white shadow-sm"
              >
                {currentSiswa.nama}
              </h2>
              <img
                src={currentSiswa.fotoSiswa || "https://placehold.co/192x256/EFEFEF/AAAAAA?text="}
                alt={`Foto ${currentSiswa.nama}`}
                className="w-48 h-64 object-cover border-4 border-gray-200 rounded-lg mx-auto mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://placehold.co/192x256/EFEFEF/AAAAAA?text=";
                }}
              />
              <div className="space-y-3">
                                  <button //NOSONAR
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg action-button flex justify-center items-center gap-2 text-sm disabled:bg-gray-400"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                  </svg>
                                  <span>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</span>
                                </button>                <div className="flex justify-between items-center">
                  <button
                    onClick={handlePrev}
                    disabled={currentSiswaIndex === 0 && currentPage === 1}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold p-2 rounded-md shadow-sm transition-all duration-200 hover:shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed disabled:shadow-none text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                  <span
                    id="nav-indicator-penilaian"
                    className="text-xs font-semibold text-gray-700"
                  >
                    Data {currentSiswaIndex + 1 + (currentPage - 1) * 10} / {allSiswa ? allSiswa.length : 0}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={!paginatedSiswa || (currentSiswaIndex === paginatedSiswa.length - 1 && currentPage === totalPages)}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold p-2 rounded-md shadow-sm transition-all duration-200 hover:shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed disabled:shadow-none text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Form Penilaian */}
            <div className="flex-grow flex flex-col gap-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-2 border border-gray-200 rounded-lg bg-gray-50/50">
                  <label
                    htmlFor="capaian_pembelajaran"
                    className="font-bold text-gray-600 mb-2 text-sm text-center block"
                  >
                    CAPAIAN PEMBELAJARAN (CP)
                  </label>
                  <textarea
                    id="capaian_pembelajaran"
                    rows={4}
                    className="w-full bg-gray-200 border border-gray-300 rounded p-2 text-xs text-gray-500"
                    readOnly
                    value={currentSiswa.capaian_pembelajaran || ''}
                    placeholder="CP diatur per kelas..."
                  />
                  <p className="text-xs text-center text-gray-500 mt-1">
                    Klik nama kelas untuk mengedit.
                  </p>
                </div>
                <div className="p-2 border border-gray-200 rounded-lg bg-gray-50/50">
                  <label
                    htmlFor="tujuan_pembelajaran"
                    className="font-bold text-gray-600 mb-2 text-sm text-center block"
                  >
                    TUJUAN PEMBELAJARAN (TP)
                  </label>
                  <textarea
                    id="tujuan_pembelajaran"
                    rows={4}
                    className="w-full bg-gray-200 border border-gray-300 rounded p-2 text-xs text-gray-500"
                    readOnly
                    value={currentSiswa.tujuan_pembelajaran || ''}
                    placeholder="TP diatur per kelas..."
                  />
                  <p className="text-xs text-center text-gray-500 mt-1">
                    Klik nama kelas untuk mengedit.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-2 border border-blue-200 rounded-lg bg-blue-50/50">
                  <h4 className="font-bold text-blue-600 mb-2 text-sm text-center">
                    🧾 SEMESTER GANJIL
                  </h4>
                  <div className="flex items-center mb-2">
                    <span className="w-20 flex-shrink-0 font-semibold text-gray-700 text-xs">
                      HARIAN
                    </span>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="nh_ganjil"
                      placeholder="0-100"
                      {...register('nh_ganjil')}
                    />
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="w-20 flex-shrink-0 font-semibold text-gray-700 text-xs">
                      STS
                    </span>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="sts_ganjil"
                      placeholder="0-100"
                      {...register('sts_ganjil')}
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 flex-shrink-0 font-semibold text-gray-700 text-xs">
                      SAS
                    </span>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="sas_ganjil"
                      placeholder="0-100"
                      {...register('sas_ganjil')}
                    />
                  </div>
                </div>
                
                <div className="p-2 border border-green-200 rounded-lg bg-green-50/50">
                  <h4 className="font-bold text-green-600 mb-2 text-sm text-center">
                    🧾 SEMESTER GENAP
                  </h4>
                  <div className="flex items-center mb-2">
                    <span className="w-20 flex-shrink-0 font-semibold text-gray-700 text-xs">
                      HARIAN
                    </span>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="nh_genap"
                      placeholder="0-100"
                      {...register('nh_genap')}
                    />
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="w-20 flex-shrink-0 font-semibold text-gray-700 text-xs">
                      STS
                    </span>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="sts_genap"
                      placeholder="0-100"
                      {...register('sts_genap')}
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 flex-shrink-0 font-semibold text-gray-700 text-xs">
                      SAS
                    </span>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="sas_genap"
                      placeholder="0-100"
                      {...register('sas_genap')}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border w-full">
                  <label htmlFor="catatan-baik" className="block font-semibold text-gray-700 mb-2 text-sm">
                    👍 CATATAN POSITIF
                  </label>
                  <textarea
                    id="catatan-baik"
                    rows={4}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Tuliskan hal-hal positif mengenai siswa..."
                    {...register('catatan_baik')}
                  />
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border w-full">
                  <label htmlFor="catatan-buruk" className="block font-semibold text-gray-700 mb-2 text-sm">
                    👎 CATATAN UNTUK PERBAIKAN
                  </label>
                  <textarea
                    id="catatan-buruk"
                    rows={4}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Tuliskan hal-hal yang perlu ditingkatkan..."
                    {...register('catatan_buruk')}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Tidak ada data siswa tersedia.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default PenilaianPage;