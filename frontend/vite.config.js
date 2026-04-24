import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Netlify in this project is configured with base=frontend and publish=frontend/dist.
    // Emit nested output only in Netlify so publish path resolves correctly.
    outDir: process.env.NETLIFY ? "frontend/dist" : "dist"
  },
  server: {
    port: 5173
  }
});
