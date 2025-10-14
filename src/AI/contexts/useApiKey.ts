import { useContext } from 'react';
import { ApiKeyContext } from './ApiKeyContext';
import { ApiKeyContextType } from './ApiKeyTypes';

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};