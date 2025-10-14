/**
 * Kelas dasar untuk semua tautan dan tombol di sidebar.
 * Ini mendefinisikan padding, transisi, dan gaya saat hover.
 */
export const baseLinkClasses =
  'flex items-center p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 group transition-colors duration-200';

/**
 * Kelas yang diterapkan pada tautan sidebar saat aktif (cocok dengan URL saat ini).
 * Ini akan menimpa beberapa gaya dari baseLinkClasses.
 */
export const activeLinkClasses = 'bg-primary-600 text-white font-semibold shadow-md hover:bg-primary-700 dark:hover:bg-primary-700';