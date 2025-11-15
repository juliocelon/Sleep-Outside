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
    // Add this to ensure static files are served correctly
    fs: {
      strict: false
    }
  },
  // Add this to exclude HTML partials from being processed
  plugins: [
    {
      name: 'html-partials',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // If requesting HTML partials, serve them as static files
          if (req.url?.includes('/partials/') && req.url?.endsWith('.html')) {
            const url = new URL(req.url, 'http://localhost');
            next();
            return;
          }
          next();
        });
      }
    }
  ]
});