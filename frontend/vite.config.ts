import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // écoute sur toutes les adresses, pour être joignable hors du conteneur
    port: 5173,
    proxy: {
      // Le front appelle /chat, Vite redirige vers le back FastAPI
      "/chat": "http://localhost:8000",
      "/briefs": "http://localhost:8000",
    },
  },
});
