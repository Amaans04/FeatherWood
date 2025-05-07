import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// This is a special Vite config for building a frontend-only static site
// that can be deployed to GitHub Pages
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  base: "./", // Use relative paths for GitHub Pages
  build: {
    outDir: path.resolve(import.meta.dirname, "github-build"),
    emptyOutDir: true,
  },
});