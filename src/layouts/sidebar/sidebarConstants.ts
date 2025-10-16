/**
 * Kelas dasar untuk semua tautan dan tombol di sidebar.
 * Ini mendefinisikan padding, transisi, dan warna teks dasar.
 */
export const baseLinkClasses =
  'flex items-center p-2 rounded-md text-slate-700 group transition-colors duration-200';

/**
 * Kelas yang diterapkan pada tautan sidebar saat aktif (cocok dengan URL saat ini).
 * Ini memberikan latar belakang utama dan warna teks putih.
 */
export const activeLinkClasses = 'bg-primary-600 text-white font-semibold shadow-md';

/**
 * Kelas yang diterapkan pada tautan sidebar saat TIDAK aktif dan disorot (hover).
 * Ini hanya memberikan latar belakang abu-abu lembut.
 */
export const inactiveHoverClasses = 'hover:bg-slate-100';