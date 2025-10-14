// Simplified database using localStorage instead of Dexie for testing purposes
import * as simpleStore from '@/shared/simpleDataStore';

export interface Activity {
  id?: number;
  title: string;
  description: string;
  timestamp: Date | string;
  type: 'info' | 'warning' | 'success' | 'error';
}

// Helper function to convert string timestamps to Date objects for sorting
const convertTimestamps = (activities: Activity[]): Activity[] => {
  return activities.map(activity => {
    if (typeof activity.timestamp === 'string') {
      return {
        ...activity,
        timestamp: new Date(activity.timestamp)
      };
    }
    return activity as Activity;
  });
};

// Simple database functions
export const db = {
  activities: {
    toArray: () => Promise.resolve(convertTimestamps(simpleStore.getCollection('dashboardStats'))),
    add: (activity: Activity) => Promise.resolve(simpleStore.addItem('dashboardStats', activity)),
    where: (criteria: Partial<Activity>) => {
      return {
        toArray: () => {
          const activities = convertTimestamps(simpleStore.getCollection('dashboardStats'));
          return Promise.resolve(
            activities.filter((activity: Activity) => {
              return Object.keys(criteria).every(key => 
                activity[key as keyof Activity] === criteria[key as keyof Activity]
              );
            })
          );
        }
      };
    },
    orderBy: (field: string) => {
      return {
        reverse: () => {
          return {
            limit: (count: number) => {
              return {
                toArray: async () => {
                  const rawActivities = await simpleStore.getCollection('dashboardStats');
                  const activities = convertTimestamps(rawActivities);
                  
                  // Sort by the specified field in descending order (reverse)
                  const sorted = [...activities].sort((a: Activity, b: Activity) => {
                    if (field === 'timestamp') {
                      // Special handling for timestamp field
                      const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
                      const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
                      return timeB - timeA; // Descending order
                    } else {
                      if (a[field as keyof Activity] < b[field as keyof Activity]) return 1;
                      if (a[field as keyof Activity] > b[field as keyof Activity]) return -1;
                      return 0;
                    }
                  });
                  // Limit to the specified count
                  return sorted.slice(0, count);
                }
              };
            }
          };
        }
      };
    }
  }
};

// Initialize with sample data if empty
const initializeSampleData = () => {
  const activities = simpleStore.getCollection('dashboardStats');
  
  // Add sample activities if empty
  if (activities.length === 0) {
    simpleStore.addItem('dashboardStats', {
      id: 1,
      title: 'Sistem diperbarui',
      description: 'Versi 1.2.0 telah diterapkan',
      timestamp: new Date().toISOString(),
      type: 'info'
    });
    
    simpleStore.addItem('dashboardStats', {
      id: 2,
      title: 'Data siswa ditambahkan',
      description: '20 data siswa baru telah diimpor',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      type: 'success'
    });
  }
};

// Initialize sample data
initializeSampleData();