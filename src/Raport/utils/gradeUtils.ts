import { Nilai } from '@/type';

export const calculateNilaiAkhir = (nilai: Nilai): number => {
  // Formula untuk menghitung nilai akhir
  // Bisa disesuaikan dengan kebutuhan
  const { nh, uts, uas } = nilai;
  
  if (nh === null || uts === null || uas === null) {
    return 0;
  }
  
  // Contoh formula: 30% NH + 30% UTS + 40% UAS
  return (nh * 0.3) + (uts * 0.3) + (uas * 0.4);
};

export const getGradePredicate = (nilaiAkhir: number): string => {
  if (nilaiAkhir >= 85) return 'A';
  if (nilaiAkhir >= 75) return 'B';
  if (nilaiAkhir >= 60) return 'C';
  return 'D';
};