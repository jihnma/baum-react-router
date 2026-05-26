import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

const ignoreChromeDevtoolsRequest = (): Plugin => ({
  name: "ignore-chrome-devtools-request",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.startsWith("/.well-known/appspecific/com.chrome.devtools")) {
        res.statusCode = 204;
        res.end();
        return;
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [ignoreChromeDevtoolsRequest(), tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
