import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService, AIAnalysisRequest } from '../AIService';
import { db, Settings } from '../database';
import toast from 'react-hot-toast';

export const useAI = () => {
  const queryClient = useQueryClient();

  // === QUERIES (untuk mengambil data) ===

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['aiSettings'],
    queryFn: async () => {
      const settingsData = await db.settings.toArray();
      if (settingsData.length > 0) {
        aiService.setApiKey(settingsData[0].apiKey);
        return settingsData[0];
      }
      return null;
    },
  });

  const { data: analysisHistory = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['aiHistory'],
    queryFn: () => aiService.getAnalysisHistory(),
  });

  // === MUTATIONS (untuk mengubah data) ===

  const { mutateAsync: updateSettings, isPending: isSaving } = useMutation({
    mutationFn: async (newSettings: Partial<Settings>) => {
      const currentSettings = await queryClient.getQueryData<Settings>(['aiSettings']);
      if (currentSettings && currentSettings.id) {
        await db.settings.update(currentSettings.id, newSettings);
        return { ...currentSettings, ...newSettings };
      } else {
        const defaultSettings = { model: 'gemini-pro', temperature: 0.7, maxTokens: 1000, ...newSettings };
        const id = await db.settings.add(defaultSettings as Settings);
        return { ...defaultSettings, id };
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['aiSettings'], data);
      if (data.apiKey) aiService.setApiKey(data.apiKey);
      toast.success('Pengaturan berhasil disimpan!');
    },
    onError: () => toast.error('Gagal menyimpan pengaturan.'),
  });

  const { mutate: runAnalysis, isPending: isAnalyzing } = useMutation({
    mutationFn: (request: AIAnalysisRequest) => aiService.analyze(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiHistory'] });
    },
    onError: (error) => toast.error(`Analisis gagal: ${error.message}`),
  });

  const { mutateAsync: verifyApiKey, isPending: isVerifying, data: apiKeyValid } = useMutation({
    mutationFn: (apiKey: string) => aiService.verifyApiKey(apiKey),
    onSuccess: (isValid) => toast.success(isValid ? 'API Key valid!' : 'API Key tidak valid!'),
    onError: () => toast.error('Gagal memverifikasi API Key.'),
  });

  return {
    settings,
    analysisHistory,
    loading: isLoadingSettings || isLoadingHistory,
    isSaving,
    isAnalyzing,
    isVerifying,
    apiKeyValid,
    updateSettings,
    runAnalysis,
    verifyApiKey,
  };
};