import React from 'react';
import { useNavigate } from 'react-router-dom';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon, path, color }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="card cursor-pointer hover:shadow-lg transition-shadow" 
      onClick={() => navigate(path)}
    >
      <div className="p-5">
        <div className="flex items-start">
          <div className={`p-3 rounded-lg ${color}`}>
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-slate-800 dark:text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAction;