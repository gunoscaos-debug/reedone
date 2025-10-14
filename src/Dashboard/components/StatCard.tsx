import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="card">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${color}`}>
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;