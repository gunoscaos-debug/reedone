// File: RaportDataContext.tsx

import React, { useState, ReactNode, useEffect, useCallback, createContext } from 'react';
import { Siswa, Nilai, RaporHeaderData, MapelData } from '@/type';
import { RaportDataContextType } from './RaportDataTypes';

// Create the context
export const RaportDataContext = createContext<RaportDataContextType | null>(null);

// --- Kunci untuk LocalStorage ---
const RAPOR_SISWA_LIST_KEY = 'rapor_siswaList';
const RAPOR_NILAI_KEY = 'rapor_nilaiData';
const RAPOR_HEADER_KEY = 'rapor_headerData';
const RAPOR_SUBJECTS_KEY = 'raport_subjects';

// --- Data Awal (Default) ---
const defaultHeaderData: RaporHeaderData = {
  reportTitle: "LAPORAN HASIL BELAJAR (RAPOR)",
  namaSekolah: "SMK Pasundan 4 Bandung",
  alamatSekolah: "Jl. Cikutra No. 201",
  waliKelas: "",
  nuptkWaliKelas: "",
  semester: "Ganjil",
  tahunAjaran: "2025/2026",
  kelasFase: "E",
  tanggalCetak: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
  bidangKeahlian: "Teknologi Informasi",
  programKeahlian: "Teknik Jaringan Komputer dan Telekomunikasi",
};

// --- Komponen Provider ---
export const RaportDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- State Management ---
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [nilai, setNilai] = useState<Record<string, Nilai>>({});
  const [headerData, setHeaderData] = useState<RaporHeaderData>(defaultHeaderData);
  const [subjects, setSubjects] = useState<MapelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Efek untuk memuat data dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    try {
      const storedSiswa = JSON.parse(localStorage.getItem(RAPOR_SISWA_LIST_KEY) || '[]') as Siswa[];
      const storedNilai = JSON.parse(localStorage.getItem(RAPOR_NILAI_KEY) || '{}') as Record<string, Nilai>;
      const storedHeader = localStorage.getItem(RAPOR_HEADER_KEY);
      const storedSubjects = JSON.parse(localStorage.getItem(RAPOR_SUBJECTS_KEY) || '[]') as MapelData[];

      setSiswaList(storedSiswa);
      setNilai(storedNilai);
      if (storedHeader) {
        setHeaderData({ ...defaultHeaderData, ...JSON.parse(storedHeader) });
      }
      setSubjects(storedSubjects);
    } catch (error) {
      console.error("Gagal memuat data rapor dari localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Sinkronisasi ke LocalStorage ---
  useEffect(() => {
    localStorage.setItem(RAPOR_SISWA_LIST_KEY, JSON.stringify(siswaList));
  }, [siswaList]);

  useEffect(() => {
    localStorage.setItem(RAPOR_NILAI_KEY, JSON.stringify(nilai));
  }, [nilai]);

  useEffect(() => {
    localStorage.setItem(RAPOR_HEADER_KEY, JSON.stringify(headerData));
  }, [headerData]);

  useEffect(() => {
    localStorage.setItem(RAPOR_SUBJECTS_KEY, JSON.stringify(subjects));
  }, [subjects]);

  // --- Fungsi Aksi ---
  const addSiswa = useCallback((data: Omit<Siswa, 'id'>) => {
    const newSiswa: Siswa = { ...data, id: `siswa-${Date.now()}` };
    setSiswaList(prev => [...prev, newSiswa]);
  }, []);

  const contextValue: RaportDataContextType = {
    siswaList,
    setSiswaList,
    addSiswa,
    nilai,
    setNilai,
    headerData,
    setHeaderData,
    subjects,
    setSubjects,
    isLoading
  };

  return <RaportDataContext.Provider value={contextValue}>{children}</RaportDataContext.Provider>;
};
