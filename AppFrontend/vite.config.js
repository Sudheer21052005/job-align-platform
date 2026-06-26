import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Runs frontend on port 3000
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Backend runs on 5000
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
