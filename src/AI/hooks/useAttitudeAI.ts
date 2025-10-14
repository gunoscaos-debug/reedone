import { useState, useCallback } from 'react';
import { AttitudeNotes, generateAttitudeNotes } from '../gemini';
import { useApiKey } from './useApiKey';
import toast from 'react-hot-toast';

export const attitudeIndicators = {
    baik: ["Disiplin Waktu", "Sopan Santun", "Kerjasama Tim", "Kreatif", "Mandiri", "Tanggung Jawab"],
    buruk: ["Sering Terlambat", "Kurang Sopan", "Individualis", "Pasif di Kelas", "Tidak Mengumpulkan Tugas", "Kurang Jujur"]
};

/**
 * Custom hook untuk mengelola logika penilaian sikap berbasis AI.
 */
export const useAttitudeAI = () => {
    const { apiKey } = useApiKey();
    const [isLoading, setIsLoading] = useState(false);
    const [attitudeInputs, setAttitudeInputs] = useState({ sakit: 0, izin: 0, alfa: 0 });
    const [selectedAttitudes, setSelectedAttitudes] = useState<Record<string, boolean>>({});

    const generate = useCallback(async (studentName: string): Promise<AttitudeNotes | null> => {
        const positive = Object.keys(selectedAttitudes).filter(key => selectedAttitudes[key] && attitudeIndicators.baik.includes(key));
        const negative = Object.keys(selectedAttitudes).filter(key => selectedAttitudes[key] && attitudeIndicators.buruk.includes(key));

        if (positive.length === 0 && negative.length === 0) {
            toast.error("Pilih setidaknya satu indikator sikap.");
            return null;
        }

        setIsLoading(true);
        try {
            const notes = await generateAttitudeNotes(studentName, {
                positive,
                negative,
                ...attitudeInputs,
                apiKey: apiKey
            });
            toast.success("Catatan sikap berhasil dibuat oleh AI!");
            // Reset input setelah berhasil
            setSelectedAttitudes({});
            setAttitudeInputs({ sakit: 0, izin: 0, alfa: 0 });
            return notes;
        } catch (error: unknown) {
            let message = "Terjadi kesalahan yang tidak diketahui";
            if (error instanceof Error) {
                message = error.message;
            }
            console.error("Error generating attitude notes:", error);
            toast.error("Gagal membuat catatan sikap: " + message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [apiKey, attitudeInputs, selectedAttitudes]);

    return { isLoading, attitudeInputs, setAttitudeInputs, selectedAttitudes, setSelectedAttitudes, generate };
};