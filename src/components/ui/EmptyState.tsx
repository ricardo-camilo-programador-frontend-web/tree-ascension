export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dashed border-canopy-line bg-canopy-bg px-4 py-5 text-center">
      <p className="font-semibold text-canopy-text">{title}</p>
      <p className="mt-1 text-sm text-canopy-muted">{body}</p>
    </div>
  )
}
