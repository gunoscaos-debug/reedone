// Menggunakan database pusat Dexie
import { db as centralDb } from '@/data/database';

// Ekspor proxy langsung ke tabel 'activities' di database pusat.
// Ini memastikan Dashboard menggunakan sumber data yang sama dengan modul lain.
export const db = {
  activities: centralDb.activities,
};
