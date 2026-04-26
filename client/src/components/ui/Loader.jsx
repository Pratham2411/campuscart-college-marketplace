import { LoaderCircle } from "lucide-react";

export default function Loader({ label = "Loading...", fullScreen = false }) {
  const wrapperClass = fullScreen
    ? "flex min-h-[50vh] items-center justify-center"
    : "flex items-center justify-center py-10";

  return (
    <div className={wrapperClass}>
      <div className="flex items-center gap-3 rounded-full bg-white/90 px-5 py-3 shadow-soft">
        <LoaderCircle className="animate-spin text-accent" size={18} />
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
    </div>
  );
}
