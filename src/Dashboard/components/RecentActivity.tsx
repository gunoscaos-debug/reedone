import React from 'react';
import { Activity } from '../database';

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="card">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'success' ? 'bg-green-100 text-green-600' :
                  activity.type === 'info' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {activity.type === 'success' ? '✓' :
                   activity.type === 'info' ? 'ℹ' :
                   activity.type === 'warning' ? '⚠' : '✕'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-800">
                    {activity.title}
                  </p>
                  <p className="text-sm text-slate-600">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {activity.timestamp instanceof Date ? activity.timestamp.toLocaleString() : new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-4">
              Tidak ada aktivitas terbaru
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;