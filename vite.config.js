import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ReactMCP from 'vite-react-mcp'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ReactMCP()],
  server: {
    proxy: {
      '/api/proxy': {
        target: 'https://gen.pollinations.ai/v1',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/proxy/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const key = req.headers['x-api-key'];
            if (key) {
              proxyReq.setHeader('Authorization', `Bearer ${key}`);
            }
          });
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          });
        },
      },
    },
  },
})
