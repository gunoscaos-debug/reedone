import React, { useState } from 'react';
import Button from '@/Komponen/Button';

interface SettingsProps {
  initialWeights?: {
    nhWeight: number;
    stsWeight: number;
    sasWeight: number;
  };
  onSave?: (weights: { nhWeight: number; stsWeight: number; sasWeight: number }) => void;
}


const Settings: React.FC<SettingsProps> = ({ initialWeights, onSave }) => {
  const [weights, setWeights] = useState({
    nhWeight: initialWeights?.nhWeight || 30,
    stsWeight: initialWeights?.stsWeight || 30,
    sasWeight: initialWeights?.sasWeight || 40
  });

  const handleSaveWeights = () => {
    const total = weights.nhWeight + weights.stsWeight + weights.sasWeight;
    
    if (total !== 100) {
      // You could add error handling here if needed
      return;
    }

    onSave?.(weights);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pengaturan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Bobot Penilaian</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <WeightInput 
              label="Nilai Harian (NH)" 
              id="nh-weight" 
              value={weights.nhWeight} 
              onChange={(value) => setWeights({...weights, nhWeight: value})} 
            />
            <WeightInput 
              label="STS" 
              id="sts-weight" 
              value={weights.stsWeight} 
              onChange={(value) => setWeights({...weights, stsWeight: value})} 
            />
            <WeightInput 
              label="SAS" 
              id="sas-weight" 
              value={weights.sasWeight} 
              onChange={(value) => setWeights({...weights, sasWeight: value})} 
            />
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Bobot
              </span>
              <span className={`text-sm font-bold ${weights.nhWeight + weights.stsWeight + weights.sasWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                {weights.nhWeight + weights.stsWeight + weights.sasWeight}%
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Total bobot penilaian harus 100%. Sesuaikan bobot setiap komponen penilaian sesuai kebutuhan.
            </p>
          </div>
          <Button 
            onClick={handleSaveWeights}
            className="w-full"
          >
            Simpan Bobot
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;