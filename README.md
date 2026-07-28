# ERP Angola — Frontend

SPA React do ERP SaaS multi-tenant para o mercado angolano. Consome a API REST do backend Laravel (`../erp-api`, `/api/v1/`). Este repositório nunca contém PHP — apenas React + TypeScript.

## Stack

- React 19 + TypeScript 5.9 (strict) + Vite 8
- Tailwind CSS v4 (CSS-first, `@theme`) + shadcn/ui (preset Nova, base Radix)
- TanStack Query v5 (server state) · Zustand v5 (client state) · React Hook Form + Zod (formulários)
- react-router v8 · axios · date-fns · recharts · vitest + Testing Library

Ver `src/design-system/tokens.css` para os tokens de cor/tipografia/espaço e `src/index.css` para o mapeamento ao shadcn.

## Requisitos

- Node 24 (ver `.nvmrc`: `nvm use`)

## Scripts

```bash
npm run dev            # servidor de desenvolvimento
npm run build          # tsc -b && vite build
npm run lint           # eslint .
npm run format         # prettier --write .
npm run format:check   # prettier --check .
npm run test           # vitest
```

## Configuração de ambiente

Copiar `.env.example` para `.env.local` e ajustar:

- `VITE_API_URL` — base da API do backend (`http://localhost/api/v1`)
- `VITE_APP_NAME` — nome apresentado na interface
- `VITE_DEV_PROXY_TARGET` — opcional; ver comentário em `vite.config.ts` (só necessário a correr fora do Docker)

## Estrutura

```
src/
├── design-system/   tokens.css + global.css (reset, tipografia base)
├── components/ui/   componentes shadcn/ui gerados
├── lib/             utilitários partilhados (cn, etc.)
└── test/            setup do vitest (@testing-library/jest-dom)
```

As pastas `api/`, `app/`, `modules/` e `shared/` (camada de API, routing, módulos do ERP, componentes/hooks partilhados) ainda não existem — ver o plano de execução do projecto.
