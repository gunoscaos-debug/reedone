import { useContext } from 'react';
import { RaportDataContext } from './RaportDataContext.tsx';
import { RaportDataContextType } from './RaportDataTypes';

export const useRaportData = (): RaportDataContextType => {
  const context = useContext(RaportDataContext);
  if (!context) {
    throw new Error('useRaportData must be used within a RaportDataProvider');
  }
  return context;
};