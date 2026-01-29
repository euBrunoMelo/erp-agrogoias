import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Diretório raiz do projeto
  root: '.',
  
  // Configuração do servidor de desenvolvimento
  server: {
    port: 3000,
    open: true,
    // Habilita CORS para desenvolvimento
    cors: true,
  },

  // Configuração de build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Otimizações para produção
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Organiza os arquivos de saída
        manualChunks: {
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-leaflet': ['leaflet', 'leaflet-draw', 'leaflet-control-geocoder', 'leaflet-measure'],
        },
      },
    },
  },

  // Resolve para Leaflet (necessário para funcionar corretamente)
  resolve: {
    alias: {
      // Garante que Leaflet encontre seus assets (imagens, etc)
      'leaflet': resolve(__dirname, 'node_modules/leaflet'),
    },
  },

  // Configuração para CSS
  css: {
    devSourcemap: true,
  },

  // Variáveis de ambiente (prefixadas com VITE_)
  envPrefix: 'VITE_',

  // Otimizações
  optimizeDeps: {
    include: [
      '@supabase/supabase-js',
      'leaflet',
      'leaflet-draw',
      'leaflet-control-geocoder',
      'leaflet-measure',
    ],
  },
});
