import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'SA IS A MOVIE - South African Entertainment & Culture',
        short_name: 'SAIM',
        description: 'Breaking down South Africa\'s hottest scandals, celebrity drama, and Amapiano events. Your source for entertainment news and culture.',
        theme_color: '#FF0000',
        background_color: '#0A0A2A',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'favicon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'favicon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks for better caching
          if (id.includes('node_modules')) {
            // Keep React and React-DOM together to avoid conflicts
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // React Router
            if (id.includes('react-router')) {
              return 'react-router';
            }
            // Clerk authentication
            if (id.includes('@clerk')) {
              return 'auth-vendor';
            }
            // Radix UI components - split into smaller chunks
            if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-dropdown-menu')) {
              return 'ui-dialog-vendor';
            }
            if (id.includes('@radix-ui/react-accordion') || id.includes('@radix-ui/react-collapsible')) {
              return 'ui-accordion-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            // Framer Motion - separate chunk for animations
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            // Form libraries
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'form-vendor';
            }
            // CMS libraries
            if (id.includes('@sanity') || id.includes('@portabletext')) {
              return 'sanity-vendor';
            }
            if (id.includes('contentful')) {
              return 'contentful-vendor';
            }
            // Utility libraries
            if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
              return 'utils-vendor';
            }
            // Icons - separate chunk for icon libraries
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            // Charts
            if (id.includes('recharts')) {
              return 'charts-vendor';
            }
            // Carousel
            if (id.includes('embla-carousel')) {
              return 'carousel-vendor';
            }
            // GitHub API
            if (id.includes('@octokit')) {
              return 'github-vendor';
            }
            // Other vendor libraries
            return 'vendor';
          }
        }
      }
    },
    // Optimize chunk sizes
    chunkSizeWarningLimit: 500,
    // Ensure consistent build output
    target: 'esnext',
    minify: 'esbuild',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize asset handling
    assetsInlineLimit: 4096,
    // Enable source maps for debugging in production
    sourcemap: false
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@clerk/clerk-react',
      'framer-motion',
      'lucide-react'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  // Configure dev server
  server: {
    port: 5173,
    // Handle admin routes properly in development
    middlewareMode: false,
    fs: {
      // Allow serving files from public directory
      allow: ['..']
    }
  },
  // Configure preview server
  preview: {
    port: 4173,
    // Handle admin routes in preview mode
    middlewareMode: false
  }
})