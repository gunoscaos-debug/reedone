// Use central Dexie database
import { db as apiDb, type GuruProfile } from '@/data/database';

// The GuruProfile interface is now imported directly from the central database module.
// This avoids type duplication and ensures consistency.

export const db = {
  profile: {
    toArray: (): Promise<GuruProfile[]> => apiDb.guruProfiles.toArray(),
    add: (profile: Omit<GuruProfile, 'id'>): Promise<number> => apiDb.guruProfiles.add(profile),
    update: (id: number, profile: Partial<GuruProfile>): Promise<number> => apiDb.guruProfiles.update(id, profile),
    where: (criteria: Partial<GuruProfile>) => apiDb.guruProfiles.where(criteria),
  }
};

// Re-export the type for convenience in other parts of the Guru module
export type { GuruProfile };