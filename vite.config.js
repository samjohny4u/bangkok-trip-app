import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { VitePWA } from "vite-plugin-pwa"; // temporarily disabled — workbox build hangs

export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: "autoUpdate",
    //   includeAssets: ["icon.svg"],
    //   manifest: {
    //     name: "Bangkok Trip 2026",
    //     short_name: "BKK 2026",
    //     description: "Family trip planner for Bangkok, April 2026",
    //     theme_color: "#0f172a",
    //     background_color: "#f8fafc",
    //     display: "standalone",
    //     orientation: "portrait",
    //     start_url: "/",
    //     icons: [
    //       {
    //         src: "icon.svg",
    //         sizes: "any",
    //         type: "image/svg+xml",
    //         purpose: "any maskable"
    //       }
    //     ]
    //   },
    //   workbox: {
    //     globPatterns: ["**/*.{js,css,html,svg,woff2}"],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    //         handler: "CacheFirst",
    //         options: {
    //           cacheName: "google-fonts-cache",
    //           expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
    //         }
    //       },
    //       {
    //         urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
    //         handler: "CacheFirst",
    //         options: {
    //           cacheName: "gstatic-fonts-cache",
    //           expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
    //         }
    //       }
    //     ]
    //   }
    // })
  ]
});
