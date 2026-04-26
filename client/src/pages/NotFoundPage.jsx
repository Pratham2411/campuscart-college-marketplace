import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="surface-card px-8 py-12">
        <p className="pill">404</p>
        <h1 className="mt-4 text-4xl font-bold text-ink">This page wandered off campus</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          The link might be outdated, or the item you're looking for may no longer be available.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link className="btn-primary" to="/marketplace">
            Explore Marketplace
          </Link>
          <Link className="btn-secondary" to="/">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
