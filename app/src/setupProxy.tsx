import { defineConfig } from 'vite';
import { createProxy } from 'vite-plugin-proxy';

export default defineConfig({
  plugins: [createProxy({
    '/api': {
      target: 'https://www.googleapis.com', // 実際のAPIエンドポイントのベースURLを指定
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api/, ''), // リクエストのパスから`/api`を削除
    },
  })],
});
