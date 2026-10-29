import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Sponsor — SUD Recovery Support',
        short_name: 'Sponsor',
        description: 'Privacy-first, offline recovery support: on-device AI, mood tracking, crisis resources.',
        theme_color: '#1f2937',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\/models\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'model-weights', expiration: { maxEntries: 20 } },
          },
        ],
      },
    }),
  ],
})
