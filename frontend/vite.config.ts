import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "wailsjs/runtime": path.resolve(__dirname, "./wailsjs/runtime/runtime.js"),
      "wailsjs": path.resolve(__dirname, "./wailsjs"),
      //"dialogs": path.resolve(__dirname, "./src/dialogs")
    },
  },
})
