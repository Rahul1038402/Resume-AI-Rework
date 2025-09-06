import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Game component gets its own chunk
          if (id.includes('GalaxyAttack')) {
            return 'game-chunk';
          }

          // React vendor chunk
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }

          // UI icons chunk
          if (id.includes('lucide-react')) {
            return 'ui-vendor';
          }

          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
}));
