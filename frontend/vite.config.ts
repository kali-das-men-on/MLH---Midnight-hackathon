import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/MLH---Midnight-hackathon/",
  server: { port: 5173 },
});