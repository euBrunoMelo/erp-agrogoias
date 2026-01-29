import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Obter __dirname equivalente em ES modules
const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  // Diretório raiz do projeto
  root: '.',
  
  // Configuração do servidor de desenvolvimento
  server: {
    port: 3000,
    open: true,
    // Habilita CORS para desenvolvimento
    cors: true,
    // Configuração de proxy (se necessário para APIs externas)
    proxy: {
      // Exemplo: se precisar fazer proxy para API do Supabase
      // '/rest/v1': {
      //   target: 'https://dajjvbzktyyjmykienwq.supabase.co',
      //   changeOrigin: true,
      //   secure: true,
      // },
    },
    // Headers de segurança
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  },

  // Configuração de preview (para testar build de produção)
  preview: {
    port: 4173,
    open: true,
    cors: true,
  },

  // Configuração de build para produção
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Limpar diretório de saída antes de build
    emptyOutDir: true,
    // Otimizações para produção
    minify: 'esbuild',
    // Tamanho limite de aviso para chunks
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Organiza os arquivos de saída em chunks
        manualChunks: {
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-leaflet': ['leaflet'],
          'vendor-leaflet-plugins': [
            'leaflet-draw',
            'leaflet-control-geocoder',
            'leaflet-measure'
          ],
        },
        // Nomes de arquivos de saída
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[ext]/[name]-[hash][extname]`;
        },
      },
    },
    // Otimizações adicionais
    target: 'esnext',
    cssCodeSplit: true,
    reportCompressedSize: true,
  },

  // Resolver paths e aliases
  resolve: {
    alias: {
      // Garante que Leaflet encontre seus assets (imagens, etc)
      'leaflet': resolve(__dirname, 'node_modules/leaflet'),
      // Aliases para paths comuns
      '@': resolve(__dirname, '.'),
      '@js': resolve(__dirname, 'js'),
      '@pages': resolve(__dirname, 'pages'),
      '@styles': resolve(__dirname, 'styles.css'),
    },
    // Extensões a serem resolvidas automaticamente
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },

  // Configuração para CSS
  css: {
    devSourcemap: true,
    // Processar CSS com PostCSS (se necessário)
    // postcss: {},
  },

  // Variáveis de ambiente (prefixadas com VITE_)
  envPrefix: 'VITE_',

  // Otimizações de dependências
  optimizeDeps: {
    include: [
      '@supabase/supabase-js',
      'leaflet',
      'leaflet-draw',
      'leaflet-control-geocoder',
      'leaflet-measure',
    ],
    // Excluir dependências que não precisam ser pré-empacotadas
    exclude: [],
  },

  // Configurações de plugins (adicionar conforme necessário)
  plugins: [
    // Plugin para copiar assets estáticos se necessário
    // Exemplo: copyPublicDir plugin
  ],

  // Configurações de base (útil para deploy em subdiretório)
  base: '/',
});
