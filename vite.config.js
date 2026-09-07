import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Directory URLs allow static hosts to serve the correct prerendered HTML.
const directoryRoutes = {
  name: "canonical-directory-routes",
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = new URL(req.url, "http://localhost");
      if (
        /^\/(studio|contact|programs|journal|toys)(\/[^/.]+)?$/.test(url.pathname)
      ) {
        res.statusCode = 302;
        res.setHeader("Location", url.pathname + "/" + url.search);
        res.end();
        return;
      }
      next();
    });
  },
};
export default defineConfig({ plugins: [react(), directoryRoutes] });
