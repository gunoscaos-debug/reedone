export interface Siswa {
  id: string;
  nama: string;
  nisn: string;
  kelas: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  tempatLahir?: string;
  tanggalLahir?: string;
  status?: string;
  alamat?: string;
  fotoUrl?: string;
  agama?: string;
  kontakSiswa?: string;
  koordinat?: string;
  namaOrangtua?: string;
  kontakOrangtua?: string;
  jarakKeSekolah?: string;
  sekolahAsal?: string;
  anakKe?: number;
  statusDalamKeluarga?: string;
  kewarganegaraan?: string;
  nh_ganjil?: number | null;
  sts_ganjil?: number | null;
  sas_ganjil?: number | null;
  nh_genap?: number | null;
  sts_genap?: number | null;
  sas_genap?: number | null;
  catatan_baik?: string;
  catatan_buruk?: string;
  capaian_pembelajaran?: string;
  tujuan_pembelajaran?: string;
}

export interface Kelas {
  id: string;
  nama: string;
  waliKelas?: string;
  kontakWaliKelas?: string;
}

// Anda bisa menambahkan tipe lain yang dibutuhkan di sini