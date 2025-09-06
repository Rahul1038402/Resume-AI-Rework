import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Only use componentTagger in development and if it exists
    mode === 'development' && (() => {
      try {
        const { componentTagger } = require("lovable-tagger");
        return componentTagger();
      } catch (e) {
        console.warn('lovable-tagger not available, skipping...');
        return null;
      }
    })(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Simplify build options for production
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep React separate
          'react-vendor': ['react', 'react-dom'],
          // Keep other large libraries separate if you use them
          'ui-vendor': ['lucide-react'],
        }
      }
    }
  },
}));