/**
 * @file src/api/siswaApi.ts
 * @description API module for managing student (Siswa) data.
 * This module abstracts the data layer operations (CRUD) for students,
 * converting between the database format (Student) and the application format (Siswa).
 */

import { db, type Student as ApiStudent } from '@/data/database';
import type { Siswa } from '@/Data_Siswa/types/type';

// --- Data Conversion Functions (Internal) ---

const convertApiStudentToSiswa = (student: ApiStudent): Siswa => ({
  id: student.id?.toString() || '',
  nama: student.name || '',
  nisn: student.nisn || '',
  kelas: student.class || '',
  jenisKelamin: student.gender || 'Laki-laki',
  tempatLahir: student.birthPlace || '',
  tanggalLahir: student.birthDate || '',
  status: student.status || 'Aktif',
  alamat: student.address || '',
  fotoUrl: student.photo || '',
  kontakSiswa: student.phone || '',
  namaOrangtua: student.parentName || '',
  kontakOrangtua: student.parentPhone || '',
});

const convertSiswaToApiStudent = (siswa: Partial<Siswa>): Partial<ApiStudent> => ({
  ...(siswa.id && { id: parseInt(siswa.id, 10) }),
  ...(siswa.nama && { name: siswa.nama }),
  ...(siswa.nisn && { nisn: siswa.nisn }),
  ...(siswa.kelas && { class: siswa.kelas }),
  ...(siswa.jenisKelamin && { gender: siswa.jenisKelamin }),
  ...(siswa.tempatLahir && { birthPlace: siswa.tempatLahir }),
  ...(siswa.tanggalLahir && { birthDate: siswa.tanggalLahir }),
  ...(siswa.status && { status: siswa.status }),
  ...(siswa.alamat && { address: siswa.alamat }),
  ...(siswa.fotoUrl && { photo: siswa.fotoUrl }),
  ...(siswa.kontakSiswa && { phone: siswa.kontakSiswa }),
  ...(siswa.namaOrangtua && { parentName: siswa.namaOrangtua }),
  ...(siswa.kontakOrangtua && { parentPhone: siswa.kontakOrangtua }),
});

// --- Public API Functions ---

export async function getAllSiswa(): Promise<Siswa[]> {
  const apiStudents = await db.students.toArray();
  return apiStudents.map(convertApiStudentToSiswa);
}

export async function getSiswaById(id: string): Promise<Siswa | undefined> {
  const student = await db.students.get(parseInt(id, 10));
  return student ? convertApiStudentToSiswa(student) : undefined;
}

export async function addSiswa(siswa: Omit<Siswa, 'id'>): Promise<number> {
  const apiStudent = convertSiswaToApiStudent(siswa) as Omit<ApiStudent, 'id'>;
  return db.students.add(apiStudent);
}

export async function updateSiswa(id: string, changes: Partial<Siswa>): Promise<number> {
  const apiChanges = convertSiswaToApiStudent(changes);
  return db.students.update(parseInt(id, 10), apiChanges);
}

export async function deleteSiswa(id: string): Promise<void> {
  await db.students.delete(parseInt(id, 10));
}

export async function bulkDeleteSiswa(ids: string[]): Promise<void> {
  const numericIds = ids.map(id => parseInt(id, 10));
  await db.students.bulkDelete(numericIds);
}
