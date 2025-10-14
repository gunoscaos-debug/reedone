import React, { useState } from 'react';
import { Button } from '@/Komponen/Button';
import { Siswa } from '@/type';

interface AIAnalysisProps {
  selectedStudent?: Siswa;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ selectedStudent }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleAnalyze = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      setAnalysis('Fitur analisis AI akan segera hadir. Contoh hasil analisis: Siswa menunjukkan peningkatan signifikan dalam kemampuan berpikir kritis dan pemecahan masalah.');
    } catch (error) {
      console.error('Error analyzing student:', error);
      setAnalysis('Gagal melakukan analisis. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Analisis AI</h2>
        <Button 
          onClick={handleAnalyze} 
          disabled={!selectedStudent || loading}
          variant="primary"
        >
          {loading ? 'Menganalisis...' : 'Analisis Siswa'}
        </Button>
      </div>
      
      {analysis && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Hasil Analisis:</h3>
          <p className="text-blue-700 dark:text-blue-300 whitespace-pre-line">{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;