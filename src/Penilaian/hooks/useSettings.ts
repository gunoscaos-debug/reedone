import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, Settings } from '../database';

const fetchSettings = async () => {
  const settingsData = await db.settings.toArray();
  return settingsData.length > 0 ? settingsData[0] : null;
};

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading: loading, error } = useQuery<Settings | null, Error>({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['settings'] });
  };

  const updateSettingsMutation = useMutation<void, Error, Partial<Settings>>({
    mutationFn: async (newSettings) => {
      if (settings) {
        await db.settings.update(settings.id!, newSettings);
      } else {
        await db.settings.add(newSettings as Settings);
      }
    },
    onSuccess: handleSuccess,
  });

  return {
    settings,
    loading,
    error: error ? error.message : null,
    updateSettings: updateSettingsMutation.mutateAsync,
  };
};
