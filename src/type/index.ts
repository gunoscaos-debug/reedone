// Tipe data untuk guru
export interface Guru {
  id: number;
  nama: string;
  nip: string;
  mataPelajaran: string;
  kelasAjar: string[];
  email?: string;
  noTelp?: string;
}

// Tipe data untuk siswa
export interface Siswa {
  id: number;
  nisn: string;
  nama: string;
  kelas: string;
  tanggalLahir?: string;
  alamat?: string;
  namaOrangTua?: string;
  noTelpOrangTua?: string;
}

// Tipe data untuk mata pelajaran
export interface Subject {
  id: number;
  name: string;
  key: string;
  kkm: number;
}

// Tipe data untuk nilai siswa
export interface NilaiSiswa {
  [siswaId: number]: {
    [key: string]: string | number;
  };
}

// Tipe data untuk header rapor
export interface RaporHeader {
  semester: 'ganjil' | 'genap';
  tahunAjaran: string;
  kegiatanAkademik: string;
}

// Tipe data untuk deskripsi predikat
export interface PredikatDeskripsi {
  [key: string]: {
    [predikat: string]: string;
  };
}

// Tipe data untuk ekstrakurikuler
export interface Ekstrakurikuler {
  id: number;
  nama: string;
  predikat: string;
  keterangan: string;
}

// Tipe data untuk ketidakhadiran
export interface Ketidakhadiran {
  sakit: number;
  izin: number;
  alfa: number;
}

export type { PreviewRow } from './ImportPreviewTypes';
