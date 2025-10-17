import React from 'react';
import { Star } from 'lucide-react';
import StatCard from './StatCard';

interface PenilaianStats {
  averageGrade: number;
  totalEntries: number;
}

interface PenilaianWidgetProps {
  stats: PenilaianStats;
  isLoading: boolean;
}

const PenilaianWidget: React.FC<PenilaianWidgetProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-soft p-6 flex items-center justify-center h-36">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const cardData = {
    title: "Nilai Rata-rata",
    value: stats.averageGrade,
    icon: <Star className="h-8 w-8 text-green-600" />,
    color: "bg-green-100",
  };

  return (
    <StatCard {...cardData} />
  );
};

export default PenilaianWidget;
