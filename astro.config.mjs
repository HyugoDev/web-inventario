// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },

  // Habilita SSR para que Spring Boot y Astro hablen más rápido
  output: 'server',
  base: '/',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover' // Precarga datos cuando el mouse pasa sobre un link
  },

  adapter: node({
    mode: 'standalone'
  })
});