# HANDOFF: fix/52-netlify-headers
- O branch foi sincronizado com a `main` (fast-forward: netlify.toml + bump 1.1.0 que estavam só na main).
- netlify.toml: removido `NPM_FLAGS = "--version"`. Adicionados `Content-Security-Policy` (permite Clarity, GA4/GTM, counter.dev e AdSense) e `Permissions-Policy`.
- pnpm-workspace.yaml: `allowBuilds: esbuild: true`. O pnpm 11 abortava o install/run com ERR_PNPM_IGNORED_BUILDS, por isso o build/lint/test local "falhava".
- Validado: `pnpm install --frozen-lockfile` + `pnpm run build` com pnpm 11 OK.
- Pendente: validar a CSP em produção (console sem violações) depois do deploy.

## fix/52-auditoria (consolidação)
- Integra as sessões Hermes `fix/52-perf-seo-a11y` (manualChunks no vite.config.ts) e `fix/52-deps` (bump de vite/vitest e overrides). Ambas foram interrompidas por timeout de modelo com o box sobrecarregado (load ~200), então o restante foi concluído à mão.
- SEO: canonical, Open Graph e Twitter card. public/icon.png criado (antes dava 404).
- a11y: text-stone-500/600 trocado por text-stone-400 (contraste AA no fundo escuro) e viewport sem bloqueio de zoom.
- CSP: o Adsterra usa domínios rotativos, então script/frame/connect liberam https:, mas sem eval, com object-src 'none' e frame-ancestors 'none'.
- Validação: tsc 0, biome 0 erros, eslint 0 erros (113 warnings), vitest 26/26, build OK (o maior chunk caiu de 518 kB para 307 kB), `pnpm install --frozen-lockfile` OK, audit de 49 para 4 vulnerabilidades.
- Pendente: zerar os warnings de lint, code-splitting de modais (React.lazy), validar a CSP em produção e o deploy de produção (Netlify sem GitHub App vinculado).
