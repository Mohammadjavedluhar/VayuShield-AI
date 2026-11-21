import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'local-api-dev-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/api/')) {
            return next();
          }

          const cleanUrl = req.url.split('?')[0];

          try {
            if (cleanUrl === '/api/intake') {
              const { default: handler } = await import('./api/intake.ts');
              return handler(req, res);
            }
            if (cleanUrl === '/api/vision-audit') {
              const { default: handler } = await import('./api/vision-audit.ts');
              return handler(req, res);
            }
            if (cleanUrl === '/api/plan') {
              const { default: handler } = await import('./api/plan.ts');
              return handler(req, res);
            }
            if (cleanUrl === '/api/ask') {
              const { default: handler } = await import('./api/ask.ts');
              return handler(req, res);
            }
          } catch (err) {
            console.error('[Vite Local Dev API Error]', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal API Server Error', details: String(err) }));
            return;
          }

          next();
        });
      },
    },
  ],
});
