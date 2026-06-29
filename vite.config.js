import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react(), tailwindcss()],
    base: './',

    server: {
      host: true,
      port: 5173,
      allowedHosts: true, // Allow all hosts for development
      strictPort: true, // Fixed typo: strictport -> strictPort

      // Development caching
      headers: {
        'Cache-Control': isProduction
          ? 'public, max-age=31536000, immutable'
          : 'no-store',
      },
    },

    preview: {
      port: 4173,
    },

    build: {
      target: 'esnext',
      sourcemap: !isProduction, // Generate source maps only in development
      chunkSizeWarningLimit: 1000, // Helps with chunk warnings
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'axios', 'zustand'],
    },
  };
});
