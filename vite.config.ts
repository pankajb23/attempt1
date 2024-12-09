import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, type UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

try{
  dotenv.config({ path: "./.env" });
}catch(e){
  console.log("error in dotenv", e);
}
// Related: https://github.com/remix-run/remix/issues/2835#issuecomment-1144102176
// Replace the HOST env var with SHOPIFY_APP_URL so that it doesn't break the remix server. The CLI will eventually
// stop passing in HOST, so we can remove this workaround after the next major release.
if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL ||
    process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

const host = new URL(process.env.SHOPIFY_APP_URL || "http://localhost")
  .hostname;

console.log("host pankaj host ", host);
// console.log("process", JSON.stringify(process.env));

let hmrConfig;
if (host === "localhost") {
  hmrConfig = {
    protocol: "ws",
    host: "localhost",
    port: 64999,
    clientPort: 64999,
  };
} else {
  hmrConfig = {
    protocol: "wss",
    host: host,
    port: parseInt(process.env.FRONTEND_PORT!) || 8002,
    clientPort: 443,
  };
}

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default defineConfig({
  server: {
    port: Number(process.env.PORT || 3000),
    hmr: hmrConfig,
    fs: {
      // See https://vitejs.dev/config/server-options.html#server-fs-allow for more information
      allow: ["app", "node_modules"],
    }
  },
  plugins: [
    remix({
      routes(defineRoutes) {
        return defineRoutes(route => {
          // Manually define routes based on file system
          const routesDir = path.resolve(__dirname, 'app', 'routes', 'store');

          function addRoutes(dir: string, basePath: string = '') {
            const files = fs.readdirSync(dir);

            files.forEach(file => {
              const fullPath = path.join(dir, file);
              const stat = fs.statSync(fullPath);

              if (stat.isDirectory()) {
                // Recursively add nested routes
                addRoutes(fullPath, path.join(basePath, file));
              } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                // Convert filename to route path
                const routeName = file.replace(/\.(tsx|ts)$/, '');
                const routePath = routeName === 'index' 
                  ? basePath || '/'
                  : path.join(basePath, routeName).replace(/\\/g, '/');

                // Add route
                console.log("routePath", routePath);
                route(
                  routePath, 
                  path.relative(path.resolve(__dirname, 'app'), fullPath)
                );
              }
            });
          }

          // Start route discovery from routes directory
          addRoutes(routesDir);
        });
      },
      appDirectory: "app",
      ignoredRouteFiles: ["**/.*"],
    }),
    tsconfigPaths(),
  ],
  build: {
    assetsInlineLimit: 0,
  },
}) satisfies UserConfig;
