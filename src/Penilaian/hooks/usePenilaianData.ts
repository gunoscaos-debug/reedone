import { useQuery } from '@tanstack/react-query';
import { db } from '@/data/database';
import { Grade } from '@/data/database';

interface PenilaianStats {
  averageGrade: number;
  totalEntries: number;
}

const fetchPenilaianStats = async (): Promise<PenilaianStats> => {
  const grades = await db.grades.toArray();

  if (grades.length === 0) {
    return { averageGrade: 0, totalEntries: 0 };
  }

  let totalScore = 0;
  let count = 0;

  grades.forEach(grade => {
    const gradeValues = [
      grade.nh_ganjil, grade.sts_ganjil, grade.sas_ganjil,
      grade.nh_genap, grade.sts_genap, grade.sas_genap
    ];

    gradeValues.forEach(value => {
      if (value !== null && value !== undefined) {
        totalScore += value;
        count++;
      }
    });
  });

  const averageGrade = count > 0 ? totalScore / count : 0;

  return {
    averageGrade: parseFloat(averageGrade.toFixed(2)),
    totalEntries: grades.length,
  };
};

export const usePenilaianData = () => {
  const { data, isLoading, isError, error } = useQuery<PenilaianStats>({
    queryKey: ['penilaianStats'],
    queryFn: fetchPenilaianStats,
  });

  return {
    stats: data || { averageGrade: 0, totalEntries: 0 },
    loading: isLoading,
    error: isError ? error : null,
  };
};
