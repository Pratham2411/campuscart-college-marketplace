export default function Footer() {
  return (
    <footer className="pb-8 pt-12">
      <div className="surface-card flex flex-col justify-between gap-4 px-6 py-5 text-sm text-slate-500 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-slate-700">CampusCart</p>
          <p>A trusted peer-to-peer marketplace designed for campus life.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="pill">React + Tailwind</span>
          <span className="pill">Express + MongoDB</span>
        </div>
      </div>
    </footer>
  );
}
