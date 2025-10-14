// Penilaian/database.ts - Bridge between api/database.ts and application data structures
import { db as apiDb, Student as ApiStudent } from './api/database';
import { Siswa } from './types/type';

// Define the Student interface from api
interface ApiStudent {
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

// Convert Student from api format to Siswa format used in application
const convertStudentToSiswa = (student: ApiStudent): Siswa => {
  const converted: Siswa = {
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
    // Include other fields as needed
  };
  
  console.log('Converting student to siswa:', student, '->', converted);
  return converted;
};

// Convert Siswa from application format to Student format used in api
const convertSiswaToStudent = (siswa: Partial<Siswa>): ApiStudent => {
  const converted: ApiStudent = {
    id: siswa.id ? parseInt(siswa.id) : undefined,
    name: siswa.nama || '',
    nisn: siswa.nisn || '',
    class: siswa.kelas || '',
    gender: siswa.jenisKelamin && (siswa.jenisKelamin === 'Laki-laki' || siswa.jenisKelamin === 'Perempuan') 
      ? siswa.jenisKelamin 
      : 'Laki-laki',
    birthPlace: siswa.tempatLahir || '',
    birthDate: siswa.tanggalLahir || '',
    status: siswa.status || 'Aktif',
    address: siswa.alamat || '',
    photo: siswa.fotoUrl || '',
    phone: siswa.kontakSiswa || '',
    parentName: siswa.namaOrangtua || '',
    parentPhone: siswa.kontakOrangtua || '',
    // Include other fields as needed
  };
  
  console.log('Converting siswa to student:', siswa, '->', converted);
  return converted;
};

// Database interface for Penilaian module
export const db = {
  siswa: {
    toArray: async (): Promise<Siswa[]> => {
      const students = (await apiDb.students.toArray()) as ApiStudent[];
      console.log('Raw students from api:', students);
      const converted = students.map(convertStudentToSiswa);
      console.log('Converted students:', converted);
      return converted;
    },
    add: async (siswa: Omit<Siswa, 'id'>): Promise<number> => {
      const student = convertSiswaToStudent(siswa);
      return await apiDb.students.add(student as Omit<ApiStudent, 'id'>);
    },
    update: async (id: string, changes: Partial<Siswa>): Promise<number> => {
      const studentChanges = convertSiswaToStudent(changes);
      return await apiDb.students.update(parseInt(id), studentChanges);
    },
    delete: async (id: string): Promise<number> => {
      return await apiDb.students.delete(parseInt(id));
    },
    bulkDelete: async (ids: string[]): Promise<void> => {
      const numericIds = ids.map(id => parseInt(id));
      // Assuming simpleStore has bulkDelete method, if not, we'll delete one by one
      if (apiDb.students.bulkDelete) {
        await apiDb.students.bulkDelete(numericIds);
      } else {
        await Promise.all(numericIds.map(id => apiDb.students.delete(id)));
      }
    },
    get: async (id: string): Promise<Siswa | undefined> => {
      const student = await apiDb.students.get(parseInt(id)) as ApiStudent | undefined;
      return student ? convertStudentToSiswa(student) : undefined;
    }
  },
  kelas: apiDb.subjects, // Di Dexie, tabel ini bernama 'subjects'
  nilai: apiDb.grades,
  pengaturan: apiDb.settings,
};