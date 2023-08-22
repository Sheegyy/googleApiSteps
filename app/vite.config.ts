import { defineConfig } from 'vite';
import { createServer } from 'vite';
import httpProxy from 'http-proxy';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://www.googleapis.com', // 実際のAPIエンドポイントのベースURLを指定
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // リクエストのパスから`/api`を削除
      },
    },
  },
});
