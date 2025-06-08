import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
    optimizeDeps: {
    include: ['@ffmpeg/ffmpeg'], // Force FFmpeg to be pre-bundled
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
