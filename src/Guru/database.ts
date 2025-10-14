// Use central Dexie database
import { db as apiDb, GuruProfile as ApiGuruProfile } from '@/Raport/database';

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

export const db = {
  profile: {
    toArray: (): Promise<ApiGuruProfile[]> => apiDb.guruProfiles.toArray(),
    add: (profile: Omit<ApiGuruProfile, 'id'>): Promise<number> => apiDb.guruProfiles.add(profile),
    update: (id: number, profile: Partial<ApiGuruProfile>): Promise<number> => apiDb.guruProfiles.update(id, profile),
    where: (criteria: Partial<ApiGuruProfile>) => apiDb.guruProfiles.where(criteria),
  }
};
