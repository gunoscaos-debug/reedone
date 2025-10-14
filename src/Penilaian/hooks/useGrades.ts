import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, Grade } from '../database';

interface GradesState {
  [studentId: number]: {
    [subjectId: number]: Grade;
  };
}

const fetchGrades = async () => {
  const gradeData = await db.grades.toArray();
  const gradesObj: GradesState = {};
  gradeData.forEach(grade => {
    if (!gradesObj[grade.studentId]) {
      gradesObj[grade.studentId] = {};
    }
    gradesObj[grade.studentId][grade.subjectId] = grade;
  });
  return gradesObj;
};

export const useGrades = () => {
  const queryClient = useQueryClient();

  const { data: grades = {}, isLoading: loading, error } = useQuery<GradesState, Error>({
    queryKey: ['grades'],
    queryFn: fetchGrades,
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['grades'] });
  };

  const updateGradeMutation = useMutation<void, Error, { studentId: number; subjectId: number; gradeData: Partial<Grade> }>({
    mutationFn: async ({ studentId, subjectId, gradeData }) => {
      const existingGrade = await db.grades
        .where({ studentId, subjectId })
        .first();
      
      if (existingGrade) {
        await db.grades.update(existingGrade.id!, gradeData);
      } else {
        await db.grades.add({
          studentId,
          subjectId,
          ...gradeData
        } as Grade);
      }
    },
    onSuccess: handleSuccess,
  });

  return {
    grades,
    loading,
    error: error ? error.message : null,
    updateGrade: (studentId: number, subjectId: number, gradeData: Partial<Grade>) => updateGradeMutation.mutateAsync({ studentId, subjectId, gradeData }),
  };
};
