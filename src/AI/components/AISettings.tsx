import React, { useEffect } from 'react';
import { useAI } from '../hooks/useAI';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Import komponen dari shadcn/ui
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Import ikon
import { CheckCircle, Info, Loader2, XCircle } from 'lucide-react';

const settingsSchema = z.object({
  apiKey: z.string().min(10, 'API Key setidaknya harus 10 karakter'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const AISettings: React.FC = () => {
  const { settings, updateSettings, verifyApiKey, isVerifying, isSaving, apiKeyValid } = useAI();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      apiKey: settings?.apiKey || '',
    },
  });

  const apiKey = watch('apiKey');

  useEffect(() => {
    if (settings?.apiKey) {
      setValue('apiKey', settings.apiKey);
    }
  }, [settings?.apiKey, setValue]);

  const handleSave = async (data: SettingsFormValues) => {
    await updateSettings({ apiKey: data.apiKey });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan AI</CardTitle>
        <CardDescription>Masukkan API key Google AI untuk mengaktifkan fitur analisis.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex">
              <Input
                type="password"
                id="apiKey"
                {...register('apiKey')}
                placeholder="Masukkan API key Anda"
                className="rounded-r-none"
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-l-none"
                onClick={() => verifyApiKey(apiKey)}
                disabled={isVerifying || !apiKey}
              >
                {isVerifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : apiKeyValid === true ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : apiKeyValid === false ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  'Cek'
                )}
              </Button>
            </div>
            {errors.apiKey && (
              <p className="text-sm text-red-600">{errors.apiKey.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button type="submit" disabled={isSaving || isSubmitting}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Pengaturan'
              )}
            </Button>
            
            {apiKeyValid === true && (
              <div className="inline-flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                API Key Valid
              </div>
            )}
            
            {apiKeyValid === false && (
              <div className="inline-flex items-center text-sm text-red-600">
                <XCircle className="h-4 w-4 mr-1" />
                API Key Tidak Valid
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Petunjuk</AlertTitle>
          <AlertDescription>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Kunjungi <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google AI Studio</a></li>
              <li>Buat dan salin API key yang dihasilkan</li>
              <li>Tempel di atas, klik "Cek", lalu "Simpan"</li>
            </ol>
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  );
};

export default AISettings;