import Dexie, { type EntityTable } from 'dexie';

export interface Student {
  id?: number;
  name: string;
  nisn: string;
  class: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthPlace?: string;
  birthDate?: string;
  status?: string;
  address?: string;
  photo?: string;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
}

export interface Subject {
  id?: number;
  nama: string; // Menggunakan 'nama' agar konsisten dengan aplikasi
  waliKelas?: string;
  kontakWaliKelas?: string;
}

export interface Grade {
  id?: number;
  studentId: number;
  subjectId: number;
  nh_ganjil: number | null;
  sts_ganjil: number | null;
  sas_ganjil: number | null;
  nh_genap: number | null;
  sts_genap: number | null;
  sas_genap: number | null;
}

export interface Settings {
  id?: number;
  // Tambahkan properti pengaturan di sini
  namaSekolah?: string;
}

export interface GuruProfile {
  id?: number;
  nama: string;
  nip: string;
  mataPelajaran: string;
  kelas: string[];
  email: string;
  telepon: string;
  alamat: string;
  tanggalLahir: string;
  foto: string | null;
  fotoLatar: string | null;
  tentang: string;
  kualifikasi: string;
  pengalaman: string;
}

export interface AIAnalysisResponse {
  id?: string; // Dexie uses 'id' as primary key, but the AI service generates string IDs
  type: string;
  content: string;
  timestamp: Date;
  relatedId?: string;
}

export interface Activity {
  id?: number;
  title: string;
  description: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'success' | 'error';
}

export class AppDB extends Dexie {
  students!: EntityTable<Student, 'id'>;
  subjects!: EntityTable<Subject, 'id'>;
  grades!: EntityTable<Grade, 'id'>;
  settings!: EntityTable<Settings, 'id'>;
  guruProfiles!: EntityTable<GuruProfile, 'id'>;
  analyses!: EntityTable<AIAnalysisResponse, 'id'>;
  activities!: EntityTable<Activity, 'id'>;

  constructor() {
    super('AppDatabase');
    this.version(5).stores({ // Bump version due to schema changes
      students: '++id, name, nisn, class',
      subjects: '++id, nama, waliKelas, kontakWaliKelas',
      grades: '++id, &[studentId+subjectId]',
      settings: '++id, apiKey', // Add apiKey to settings
      guruProfiles: '++id, nama, nip',
      analyses: 'id, type, timestamp', // 'id' as primary key, not auto-incremented
      activities: '++id, timestamp, type',
    });

    this.on('populate', () => {
      this.activities.bulkAdd([
        {
          title: 'Sistem diperbarui',
          description: 'Versi 1.2.0 telah diterapkan',
          timestamp: new Date(),
          type: 'info'
        },
        {
          title: 'Data siswa ditambahkan',
          description: '20 data siswa baru telah diimpor',
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          type: 'success'
        }
      ]);
    });
  }
}

export const db = new AppDB();