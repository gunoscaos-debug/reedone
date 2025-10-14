import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, Subject } from '../database';

const fetchSubjects = async () => {
  const data = await db.subjects.toArray();
  return data;
};

export const useSubjects = () => {
  const queryClient = useQueryClient();

  const { data: subjects = [], isLoading: loading, error } = useQuery<Subject[], Error>({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['subjects'] });
  };

  const addSubjectMutation = useMutation<number, Error, Omit<Subject, 'id'>>({
    mutationFn: async (subject) => {
      return await db.subjects.add(subject);
    },
    onSuccess: handleSuccess,
  });

  const updateSubjectMutation = useMutation<void, Error, { id: number; subject: Partial<Subject> }>({
    mutationFn: async ({ id, subject }) => {
      await db.subjects.update(id, subject);
    },
    onSuccess: handleSuccess,
  });

  const deleteSubjectMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await db.subjects.delete(id);
    },
    onSuccess: handleSuccess,
  });

  return {
    subjects,
    loading,
    error: error ? error.message : null,
    addSubject: addSubjectMutation.mutateAsync,
    updateSubject: (id: number, subject: Partial<Subject>) => updateSubjectMutation.mutateAsync({ id, subject }),
    deleteSubject: deleteSubjectMutation.mutateAsync,
  };
};
