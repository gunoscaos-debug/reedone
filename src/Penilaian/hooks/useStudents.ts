import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, Student } from '../database';

const fetchStudents = async () => {
  const data = await db.students.toArray();
  return data;
};

export const useStudents = () => {
  const queryClient = useQueryClient();

  const { data: students = [], isLoading: loading, error } = useQuery<Student[], Error>({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['students'] });
  };

  const addStudentMutation = useMutation<number, Error, Omit<Student, 'id'>>({
    mutationFn: async (student) => {
      return await db.students.add(student);
    },
    onSuccess: handleSuccess,
  });

  const updateStudentMutation = useMutation<void, Error, { id: number; student: Partial<Student> }>({
    mutationFn: async ({ id, student }) => {
      await db.students.update(id, student);
    },
    onSuccess: handleSuccess,
  });

  const deleteStudentMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await db.students.delete(id);
    },
    onSuccess: handleSuccess,
  });

  return {
    students,
    loading,
    error: error ? error.message : null,
    addStudent: addStudentMutation.mutateAsync,
    updateStudent: (id: number, student: Partial<Student>) => updateStudentMutation.mutateAsync({ id, student }),
    deleteStudent: deleteStudentMutation.mutateAsync,
  };
};
