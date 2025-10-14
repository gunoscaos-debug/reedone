import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  generateStudentAnalysis,
  generateAttitudeNotes,
  generateTeacherNote,
  AttitudeData,
  TeacherNoteData,
} from '@/AI/gemini';
import { Siswa, Nilai } from '@/type';

export const useAIAssistant = () => {
  // Mutasi untuk analisis siswa
  const { mutateAsync: analyzeStudent, isPending: isAnalyzingStudent } = useMutation({
    mutationFn: ({ siswa, nilai, apiKey }: { siswa: Siswa; nilai: Nilai | undefined; apiKey: string }) =>
      generateStudentAnalysis(siswa, nilai, apiKey),
    onError: (error: Error) => {
      toast.error(`Gagal menganalisis siswa: ${error.message}`);
    },
  });

  // Mutasi untuk catatan sikap
  const { mutateAsync: createAttitudeNotes, isPending: isCreatingAttitudeNotes } = useMutation({
    mutationFn: ({ studentName, attitudeData }: { studentName: string; attitudeData: AttitudeData }) =>
      generateAttitudeNotes(studentName, attitudeData),
    onError: (error: Error) => {
      toast.error(`Gagal membuat catatan sikap: ${error.message}`);
    },
  });

  // Mutasi untuk catatan wali kelas
  const { mutateAsync: createTeacherNote, isPending: isCreatingTeacherNote } = useMutation({
    mutationFn: (data: TeacherNoteData) => generateTeacherNote(data),
    onError: (error: Error) => {
      toast.error(`Gagal membuat catatan wali kelas: ${error.message}`);
    },
  });

  return {
    analyzeStudent,
    isAnalyzingStudent,
    createAttitudeNotes,
    isCreatingAttitudeNotes,
    createTeacherNote,
    isCreatingTeacherNote,
    isGenerating: isAnalyzingStudent || isCreatingAttitudeNotes || isCreatingTeacherNote,
  };
};