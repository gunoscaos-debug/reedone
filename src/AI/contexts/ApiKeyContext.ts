import { createContext } from 'react';
import { ApiKeyContextType } from './ApiKeyTypes';

export const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);