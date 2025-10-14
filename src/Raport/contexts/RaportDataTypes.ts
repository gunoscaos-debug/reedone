import { Dispatch, SetStateAction } from 'react';
import { Siswa, Nilai, RaporHeaderData, MapelData } from '@/type';

export interface RaportDataContextType {
  siswaList: Siswa[];
  setSiswaList: Dispatch<SetStateAction<Siswa[]>>;
  addSiswa: (data: Omit<Siswa, 'id'>) => void;
  nilai: Record<string, Nilai>;
  setNilai: Dispatch<SetStateAction<Record<string, Nilai>>>;
  headerData: RaporHeaderData;
  setHeaderData: Dispatch<SetStateAction<RaporHeaderData>>;
  subjects: MapelData[];
  setSubjects: Dispatch<SetStateAction<MapelData[]>>;
  isLoading: boolean;
}