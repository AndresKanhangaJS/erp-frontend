/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Alvo do proxy /api do servidor de dev do Vite.
//
// Por omissão aponta para "http://nginx" — o alias de rede Docker do
// Nginx da raiz, alcançável a partir do container frontend-dev na
// mesma rede (ver infra/docker/docker-compose.yml). "http://localhost"
// (o valor antigo aqui) só funcionava a correr o Vite fora do Docker:
// dentro do container, "localhost" é o próprio container, nunca o Nginx.
//
// Se corres `npm run dev` fora do Docker, define VITE_DEV_PROXY_TARGET
// no teu .env.local (ver .env.example) para "http://localhost" ou onde
// o Nginx estiver publicado.
const devProxyTarget = process.env.VITE_DEV_PROXY_TARGET || 'http://nginx'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: devProxyTarget,
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // @testing-library/jest-dom nesta versão espera um `expect` global
    // (chama expect.extend() no import) — não há entrada dedicada ao
    // Vitest nesta versão do pacote. Os testes continuam a importar
    // describe/it/expect explicitamente de 'vitest'; isto só liga o
    // registo dos matchers do jest-dom.
    globals: true,
  },
})
