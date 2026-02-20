import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  // Usamos useState para asegurar que el QueryClient se cree solo una vez
  // por cada sesión del navegador, evitando fugas de memoria.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minuto
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};