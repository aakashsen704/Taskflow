import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <span className="font-mono text-xs text-muted">#0000</span>
      <h1 className="mt-2 font-display text-5xl font-semibold text-ink">Card not filed</h1>
      <p className="mt-3 max-w-sm text-sm text-muted">
        There's nothing in the catalog at this address. It may have moved, or never
        existed.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
