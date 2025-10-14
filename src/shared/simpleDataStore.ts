// Simple data storage service to replace Dexie for testing purposes
const DB_KEY = 'app_simple_db';

// Define types for our data
interface DatabaseStructure {
  students: unknown[];
  subjects: unknown[];
  grades: unknown[];
  settings: Record<string, unknown>;
  aiSettings: Record<string, unknown>;
  aiAnalyses: unknown[];
  guruProfiles: unknown[];
  dashboardStats: unknown[];
  [key: string]: unknown[] | Record<string, unknown>; // Constrain the index signature to either arrays or record objects
}

// Load data from localStorage
const loadData = (): DatabaseStructure => {
  try {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : {
      students: [],
      subjects: [],
      grades: [],
      settings: {},
      aiSettings: {},
      aiAnalyses: [],
      guruProfiles: [],
      dashboardStats: [],
    };
  } catch (e) {
    console.error('Error loading data from localStorage:', e);
    return {
      students: [],
      subjects: [],
      grades: [],
      settings: {},
      aiSettings: {},
      aiAnalyses: [],
      guruProfiles: [],
      dashboardStats: [],
    };
  }
};

// Save data to localStorage
const saveData = (data: DatabaseStructure): void => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data to localStorage:', e);
  }
};

// Initialize with default data
const initializeData = (): DatabaseStructure => {
  const existingData = loadData();
  const defaultData: DatabaseStructure = {
    students: [],
    subjects: [],
    grades: [],
    settings: {},
    aiSettings: {},
    aiAnalyses: [],
    guruProfiles: [],
    dashboardStats: [],
  };
  
  // Merge with existing data to avoid property duplication
  const mergedData = { ...defaultData, ...existingData };
  
  saveData(mergedData);
  return mergedData;
};

// Get all data
export const getAllData = (): DatabaseStructure => {
  const data = loadData();
  return Object.keys(data).length > 0 ? data : initializeData();
};

// Get data by collection name
export const getCollection = (collectionName: string): unknown[] => {
  const data = getAllData();
  const collection = data[collectionName];
  // Ensure we return an array, even if the collection doesn't exist or isn't an array
  return Array.isArray(collection) ? collection : [];
};

// Add item to collection
export const addItem = <T extends { id?: number }>(collectionName: string, item: T): T => {
  const data = getAllData();
  const rawData = data[collectionName];
  const collection = Array.isArray(rawData) ? rawData : [];
  
  // Add ID if not present
  if (!item.id) {
    item.id = Date.now();
  }
  
  collection.push(item);
  data[collectionName] = collection;
  saveData(data);
  
  return item;
};

// Update item in collection
export const updateItem = <T extends { id: number | string }>(
  collectionName: string, 
  id: number | string, 
  updates: Partial<T>
): T | null => {
  const data = getAllData();
  const rawData = data[collectionName];
  const collection = (Array.isArray(rawData) ? rawData : []).map(item => item as T);
  
  const index = collection.findIndex((item: T) => item.id === id);
  if (index !== -1) {
    collection[index] = { ...collection[index], ...updates };
    data[collectionName] = collection;
    saveData(data);
    return collection[index];
  }
  
  return null;
};

// Delete item from collection
export const deleteItem = (collectionName: string, id: number | string): unknown | null => {
  const data = getAllData();
  const rawData = data[collectionName];
  const collection = (Array.isArray(rawData) ? rawData : []).map(item => item as { id: number | string });
  
  const index = collection.findIndex((item: { id: number | string }) => item.id === id);
  if (index !== -1) {
    const deletedItem = collection.splice(index, 1)[0];
    data[collectionName] = collection;
    saveData(data);
    return deletedItem;
  }
  
  return null;
};

// Find items in collection
export const findItems = <T,>(
  collectionName: string, 
  predicate: (item: T) => boolean
): T[] => {
  const collection = getCollection(collectionName);
  return collection.filter(item => predicate(item as T)) as T[];
};

// Clear all data
export const clearAllData = (): void => {
  localStorage.removeItem(DB_KEY);
  initializeData();
};


