// Simplified database using localStorage instead of Dexie for testing purposes
import * as simpleStore from '@/shared/simpleDataStore';

export interface AISettings {
  id?: number;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface AIAnalysisResponse {
  id: string;
  type: string;
  content: string;
  timestamp: Date;
  relatedId?: string;
}

export type AIAnalysisDB = AIAnalysisResponse;

// Simple database functions
export const db = {
  analyses: {
    toArray: () => Promise.resolve(simpleStore.getCollection('aiAnalyses')),
    add: (analysis: AIAnalysisDB) => Promise.resolve(simpleStore.addItem('aiAnalyses', analysis)),
    where: (criteria: Partial<AIAnalysisDB>) => {
      return {
        toArray: () => {
          const analyses = simpleStore.getCollection('aiAnalyses');
          return Promise.resolve(
            analyses.filter((analysis: AIAnalysisDB) => {
              return Object.keys(criteria).every(key => 
                analysis[key as keyof AIAnalysisDB] === criteria[key as keyof AIAnalysisDB]
              );
            })
          );
        }
      };
    }
  },
  settings: {
    toArray: () => Promise.resolve(simpleStore.getCollection('aiSettings')),
    put: (settings: AISettings) => {
      const collection = simpleStore.getCollection('aiSettings');
      if (collection.length > 0) {
        return Promise.resolve(simpleStore.updateItem('aiSettings', collection[0].id, settings));
      } else {
        return Promise.resolve(simpleStore.addItem('aiSettings', {...settings, id: 1}));
      }
    },
  }
};

// Initialize with default data
const initializeDefaultData = () => {
  const settings = simpleStore.getCollection('aiSettings');
  
  // Add default settings if empty
  if (settings.length === 0) {
    simpleStore.addItem('aiSettings', {
      id: 1,
      apiKey: '',
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 1000
    });
  }
};

// Initialize default data
initializeDefaultData();