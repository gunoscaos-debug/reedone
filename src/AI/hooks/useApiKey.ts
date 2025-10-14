import { useContext } from 'react';
import { ApiKeyContext, ApiKeyContextType } from '../contexts/ApiKeyContext';

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};