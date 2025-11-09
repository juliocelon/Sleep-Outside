import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/Sleep-Outside/' : '/',
  root: "src/",
  publicDir: "src/public",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
      },
    },
    assetsInclude: ['**/*.jpg', '**/*.png', '**/*.svg', '**/*.json'],
  },
  server: {
    open: true,
  },
});