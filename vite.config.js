import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "prodiction" ? "/jimmy81726/react_w2hw/" : "/",
  plugins: [react()],
});
