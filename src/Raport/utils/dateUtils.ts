/**
 * Memformat tanggal menjadi format Indonesia (DD MMMM YYYY)
 * @param dateString String tanggal dalam format ISO
 * @returns Tanggal yang diformat
 */
export const formatTanggal = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Memformat tanggal menjadi format Indonesia yang singkat (DD/MM/YYYY)
 * @param dateString String tanggal dalam format ISO
 * @returns Tanggal yang diformat secara singkat
 */
export const formatTanggalSingkat = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};