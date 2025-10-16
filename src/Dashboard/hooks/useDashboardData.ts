import { useState, useEffect } from 'react';
import { db, Activity } from '../database';

interface StatData {
  totalStudents: number;
  totalClasses: number;
  totalSubjects: number;
}



export const useDashboardData = () => {
  const [stats, setStats] = useState<StatData>({
    totalStudents: 0,
    totalClasses: 0,
    totalSubjects: 0
  });
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulasi pengambilan data statistik
      setTimeout(() => {
        setStats({
          totalStudents: 142,
          totalClasses: 8,
          totalSubjects: 16
        });
      }, 500);
      
      // Ambil aktivitas dari database
      const storedActivities = await db.activities.orderBy('timestamp').reverse().limit(10).toArray();
      setActivities(storedActivities);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    try {
      await db.activities.add(activity);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  return {
    stats,
    activities,
    loading,
    error,
    addActivity,
    refreshData: loadData
  };
};