export default function Alert({ variant = "error", children }) {
  const classes =
    variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-rose-200 bg-rose-50 text-rose-800";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${classes}`}>
      {children}
    </div>
  );
}
