# HANDOFF: fix/52-netlify-headers
- O branch foi sincronizado com a `main` (fast-forward: netlify.toml + bump 1.1.0 que estavam só na main).
- netlify.toml: removido `NPM_FLAGS = "--version"`. Adicionados `Content-Security-Policy` (permite Clarity, GA4/GTM, counter.dev e AdSense) e `Permissions-Policy`.
- pnpm-workspace.yaml: `allowBuilds: esbuild: true`. O pnpm 11 abortava o install/run com ERR_PNPM_IGNORED_BUILDS, por isso o build/lint/test local "falhava".
- Validado: `pnpm install --frozen-lockfile` + `pnpm run build` com pnpm 11 OK.
- Pendente: validar a CSP em produção (console sem violações) depois do deploy.
