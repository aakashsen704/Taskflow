import Layout from "../../components/Layout.jsx";
import { useAuth } from "../../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <Layout title="Profile" subtitle="Your account, managed entirely by Google.">
      <div className="max-w-lg rounded-card border border-line bg-card p-6 shadow-card">
        <div className="flex items-center gap-4">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-light text-xl font-semibold text-accent-dark">
              {user?.name?.[0] ?? "?"}
            </span>
          )}
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">{user?.name}</h2>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Member since</dt>
            <dd className="mt-1 font-mono text-ink">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Sign-in method</dt>
            <dd className="mt-1 font-medium text-ink">Google OAuth</dd>
          </div>
        </dl>

        <p className="mt-6 rounded-lg bg-paper p-3 text-xs text-muted">
          TaskFlow never stores a password — your identity is verified by Google on every
          login, and only your name, email, and profile photo are kept.
        </p>
      </div>
    </Layout>
  );
}
