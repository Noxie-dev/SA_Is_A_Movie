import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
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
            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            // Framer Motion
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            // Form libraries
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'form-vendor';
            }
            // Sanity CMS
            if (id.includes('@sanity') || id.includes('@portabletext')) {
              return 'sanity-vendor';
            }
            // Contentful
            if (id.includes('contentful')) {
              return 'contentful-vendor';
            }
            // Utility libraries
            if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
              return 'utils-vendor';
            }
            // Icons
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
    // Increase chunk size warning limit to 1000kb for better optimization
    chunkSizeWarningLimit: 1000,
    // Ensure consistent build output
    target: 'esnext',
    minify: 'esbuild'
  }
})
