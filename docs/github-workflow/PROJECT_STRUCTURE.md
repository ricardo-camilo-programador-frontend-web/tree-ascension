# Estrutura do Projeto - Tree Ascension

## Visao Geral

Aplicacao React com Vite demonstrando tecnicas modernas de frontend.

## Diretorios

```
tree-ascension/
├── src/
│   ├── components/         # Componentes React
│   │   ├── ui/             # Componentes UI reutilizaveis
│   │   └── features/       # Componentes de features
│   ├── hooks/              # Custom Hooks
│   ├── utils/              # Funcoes utilitarias
│   ├── types/              # Tipos TypeScript
│   └── assets/             # Assets (imagens, icones)
├── public/                 # Arquivos estaticos
├── docs/                   # Documentacao
│   └── github-workflow/    # Padroes GitHub
└── .github/                # Templates e CI/CD
```

## Convencoes

### Nomenclatura
- Componentes: PascalCase (TreeNode.tsx)
- Hooks: camelCase com prefixo use (useTree.ts)
- Tipos: PascalCase com sufixo (NodeType.ts)

## Stack

| Camada | Tecnologia |
|--------|------------|
| Build | Vite 6 |
| UI | React 19 |
| Estilos | TailwindCSS v4 |
| Linguagem | TypeScript |
