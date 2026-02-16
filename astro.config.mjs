// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server', // Habilita SSR para que Spring Boot y Astro hablen más rápido
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover' // Precarga datos cuando el mouse pasa sobre un link
  }
});