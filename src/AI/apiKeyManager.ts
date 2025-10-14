// Simplified API key manager using localStorage instead of Dexie for testing purposes

const API_KEY_STORAGE_KEY = 'shared_gemini_api_key';

export async function getSharedApiKey(): Promise<string | null> {
  try {
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    return apiKey || null;
  } catch (error) {
    console.error("Gagal mengambil API key bersama:", error);
    return null;
  }
}

export async function saveSharedApiKey(apiKey: string): Promise<void> {
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  } catch (error) {
    console.error("Gagal menyimpan API key bersama:", error);
    throw error;
  }
}

export async function deleteSharedApiKey(): Promise<void> {
  try {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  } catch (error) {
    console.error("Gagal menghapus API key bersama:", error);
    throw error;
  }
}