export interface PreviewRow {
  data: Record<string, unknown>; // Ganti any dengan Record
  isValid: boolean;
  errors: string[];
}