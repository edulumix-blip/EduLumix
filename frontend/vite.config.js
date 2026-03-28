import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // .env / .env.local must be read here — process.env alone often misses VITE_* for proxy
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_TARGET || 'http://localhost:5000';

  return {
  plugins: [
    {
      name: 'edulumix-log-api-proxy',
      configureServer() {
        console.log(`[EduLumix] Vite /api proxy → ${apiTarget}`);
      },
    },
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'EduLumix - Complete Career Platform',
        short_name: 'EduLumix',
        description: 'Fresher jobs, free resources, courses, mock tests & career guidance',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      },
      workbox: {
        // Lighter first install: don't precache every hashed JS chunk (was ~100+ files).
        globPatterns: ['**/*.{css,html,ico,png,svg,woff2,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' || request.destination === 'style',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          { urlPattern: /^https:\/\/api\./i, handler: 'NetworkFirst', options: { cacheName: 'api-cache', networkTimeoutSeconds: 10 } },
        ],
      },
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.warn('[Vite proxy] Backend unreachable. Is the server running on', apiTarget, '?', err.message);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            if (proxyRes.statusCode === 404 && req.url?.startsWith('/api')) {
              console.warn('[Vite proxy] Backend returned 404 for', req.method, req.url);
            }
          });
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  };
});
