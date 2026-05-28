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
      minify: 'esbuild', // Better production optimization
      sourcemap: !isProduction, // Generate source maps only in development
      chunkSizeWarningLimit: 1000, // Helps with chunk warnings

      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom', 'axios'], // Core framework
            state: ['zustand'], // State management
            icons: ['lucide-react'], // Icons
            pdf: ['@react-pdf/renderer'], // Heavy libraries
          },
        },
      },
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'axios', 'zustand'],
    },
  };
});
