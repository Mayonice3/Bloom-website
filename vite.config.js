import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Bloom-website/",
  server: {
    allowedHosts: [
      'sb-3gzs3ppon357.vercel.run'
    ]

  }
});
