import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    server: {
        watch: {
            usePolling: true,
            interval: 100,
            batchSize: 100,
            ignored: [
                "**/node_modules/**",
                "**/dist/**",
                "**/.git/**",
                "**/logs/**",
            ],
        },
        fs: {
            strict: false,
        },
    },
});
