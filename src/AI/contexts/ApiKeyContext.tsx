import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { getSharedApiKey, saveSharedApiKey } from '../apiKeyManager';
import toast from 'react-hot-toast';
import { ApiKeyContext } from './ApiKeyContext';

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  useEffect(() => {
    getSharedApiKey().then(key => setApiKey(key || ''));
  }, []);

  const saveApiKey = useCallback(async (key: string) => {
    await saveSharedApiKey(key);
    setApiKey(key);
    toast.success('API Key berhasil disimpan.');
    setIsApiKeyModalOpen(false);
  }, []);

  const openApiKeyModal = () => setIsApiKeyModalOpen(true);
  const closeApiKeyModal = () => setIsApiKeyModalOpen(false);

  return (
    <ApiKeyContext.Provider value={{ apiKey, saveApiKey, isApiKeyModalOpen, openApiKeyModal, closeApiKeyModal }}>
      {children}
    </ApiKeyContext.Provider>
  );
};