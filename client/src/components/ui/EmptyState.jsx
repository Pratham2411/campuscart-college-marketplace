export default function EmptyState({
  title,
  description,
  action = null
}) {
  return (
    <div className="surface-card px-6 py-10 text-center">
      <h3 className="text-2xl font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
