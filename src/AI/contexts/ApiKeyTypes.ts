export interface ApiKeyContextType {
  apiKey: string;
  saveApiKey: (key: string) => Promise<void>;
  isApiKeyModalOpen: boolean;
  openApiKeyModal: () => void;
  closeApiKeyModal: () => void;
}