import { createContext } from 'react';
import { RaportDataContextType } from './RaportDataTypes';

export const RaportDataContext = createContext<RaportDataContextType | undefined>(undefined);