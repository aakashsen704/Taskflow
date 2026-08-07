import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { googleLoginUrl } from "../../services/api";
import toast from "react-hot-toast";

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (params.get("error") === "auth_failed") {
      toast.error("Google sign-in didn't go through. Try again.");
    }
  }, [params]);

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left: identity panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink px-12 py-10 text-paper md:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">T</span>
          <span className="font-display text-xl font-semibold">TaskFlow</span>
        </div>

        <div>
          <h1 className="max-w-md font-display text-4xl font-medium leading-tight">
            A catalog for everything you mean to get to.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-paper/70">
            Sign in once with Google — every task, sorted, searchable, and only ever
            visible to you.
          </p>
        </div>

        {/* Stacked catalog-card motif */}
        <div className="relative h-28 w-52">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute h-16 w-52 rounded-md border border-paper/20 bg-paper/5"
              style={{ top: i * 10, left: i * 6, transform: `rotate(${(i - 1) * 2}deg)` }}
            />
          ))}
        </div>
      </div>

      {/* Right: sign-in action */}
      <div className="flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 md:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">T</span>
            <span className="font-display text-xl font-semibold text-ink">TaskFlow</span>
          </div>

          <h2 className="font-display text-2xl font-semibold text-ink">Welcome back</h2>
          <p className="mt-1 text-sm text-muted">Sign in to see your tasks.</p>

          <a
            href={googleLoginUrl}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border border-line bg-card px-4 py-3 text-sm font-medium text-ink shadow-card transition-shadow hover:shadow-lift"
          >
            <GoogleIcon className="h-4 w-4" />
            Continue with Google
          </a>

          <p className="mt-6 text-center text-xs text-muted">
            No passwords, ever — your Google account is the only key.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 18 18" {...props}>
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.95 10.7a5.4 5.4 0 0 1 0-3.4V4.97H.98a9 9 0 0 0 0 8.06l2.97-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .98 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58Z" />
    </svg>
  );
}
