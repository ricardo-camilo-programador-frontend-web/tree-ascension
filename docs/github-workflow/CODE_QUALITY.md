# Padroes de Qualidade - React + Vite

## Stack

| Tecnologia | Uso |
|------------|-----|
| React 19 | UI |
| Vite | Build |
| TypeScript | Linguagem |
| TailwindCSS v4 | Estilos |

## TypeScript

```typescript
// BOM
interface User {
  id: number
  name: string
}

const users: User[] = []
function getUser(id: number): Promise<User> { }
```

## React Patterns

### Componentes
```tsx
// BOM
interface Props {
  title: string
  onClick?: () => void
}

export function Button({ title, onClick }: Props) {
  return <button onClick={onClick}>{title}</button>
}
```

### Hooks
```tsx
// BOM
useEffect(() => {
  fetchData(id)
}, [id])  // Dependencias corretas
```

## Comandos

```bash
npm run dev      # Dev server
npm run build    # Build
npm run preview  # Preview
npm run lint     # Type check
```

## Checklist

- [ ] TypeScript strict
- [ ] Hooks com dependencias corretas
- [ ] TailwindCSS v4 syntax
