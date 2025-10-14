import React from 'react';
import { AIAnalysisResponse } from '../AIService';

interface AIHistoryProps {
  history: AIAnalysisResponse[];
  onSelectAnalysis?: (analysis: AIAnalysisResponse) => void;
}

const AIHistory: React.FC<AIHistoryProps> = ({ history, onSelectAnalysis }) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'student-analysis': return 'Analisis Siswa';
      case 'class-analysis': return 'Analisis Kelas';
      case 'subject-analysis': return 'Analisis Mata Pelajaran';
      case 'teacher-analysis': return 'Analisis Guru';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'student-analysis': return 'bg-blue-100 text-blue-800';
      case 'class-analysis': return 'bg-green-100 text-green-800';
      case 'subject-analysis': return 'bg-purple-100 text-purple-800';
      case 'teacher-analysis': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Riwayat Analisis AI</h2>
      
      {history.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada riwayat analisis AI</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((analysis) => (
            <div 
              key={analysis.id} 
              className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
                onSelectAnalysis ? 'hover:border-blue-300' : ''
              }`}
              onClick={() => onSelectAnalysis && onSelectAnalysis(analysis)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(analysis.type)}`}>
                    {getTypeLabel(analysis.type)}
                  </span>
                  <p className="mt-2 text-sm text-gray-900 line-clamp-2">
                    {analysis.content.substring(0, 100)}...
                  </p>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(analysis.timestamp).toLocaleDateString('id-ID')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIHistory;