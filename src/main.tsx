import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.tsx';
import './index.css';
import './Raport/styles/print.css'; // Impor CSS untuk print

// 1. Buat instance client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Bungkus aplikasi Anda dengan provider */}
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-background text-foreground">Loading...</div>}>
        <App />
      </Suspense>
      {/* 3. (Opsional tapi sangat direkomendasikan) Tambahkan Devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);