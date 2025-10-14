import { useState, useCallback } from 'react';
import { Siswa, Nilai, MapelData } from '@/type';
import { useApiKey } from './useApiKey';
import toast from 'react-hot-toast';

// Asumsi fungsi ini ada di suatu tempat, misal di utils
const calculateNilaiAkhir = (nilai: Nilai) => (nilai.nh || 0) * 0.3 + (nilai.uts || 0) * 0.3 + (nilai.uas || 0) * 0.4;

export const useAIAssistant = () => {
  const { apiKey } = useApiKey();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);

  /**
   * Fungsi untuk menghasilkan prompt AI otomatis berdasarkan data siswa dan nilai.
   */
  const generateAutoPrompt = useCallback((siswa: Siswa, nilaiSiswa: Record<string, Nilai>, subjects: MapelData[]): string => {
    const nilaiData = subjects.map(subject => {
      const nilai = nilaiSiswa[subject.id];
      if (!nilai || nilai.nh === null || nilai.uts === null || nilai.uas === null) return `${subject.nama}: belum diisi`;
      const nilaiAkhir = calculateNilaiAkhir(nilai as Nilai);
      return `${subject.nama}: ${nilaiAkhir.toFixed(2)}`;
    }).join(', ');
    
    return `Buatkan analisis dan saran akademik untuk siswa ${siswa.nama} dari kelas ${siswa.kelas} dengan nilai: ${nilaiData}. Berikan dalam format yang ramah dan mudah dipahami.`;
  }, []);

  /**
   * Fungsi untuk mengirim prompt ke AI.
   * @param prompt - Teks prompt yang akan dikirim.
   */
  const generateAIResponse = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!apiKey) {
        throw new Error("API Key belum diatur.");
      }
      // Simulasi pemanggilan API Gemini
      await new Promise(resolve => setTimeout(resolve, 1500));
      const response = `Ini adalah hasil analisis untuk prompt: "${prompt.substring(0, 50)}..."`;
      setReport(response);
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui.";
      setError(message);
      toast.error(`Gagal menghasilkan respons AI: ${message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const reset = () => {
    setReport(null);
    setError(null);
  };

  return { 
    isLoading, 
    error, 
    report, 
    generateAutoPrompt,
    generateAIResponse, 
    reset 
  };
};