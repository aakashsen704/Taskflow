import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: FolderIcon },
  { to: "/profile", label: "Profile", icon: UserIcon },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-paper px-5 py-6 md:flex">
      <div className="mb-10 flex items-center gap-2 px-1">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
          T
        </span>
        <span className="font-display text-xl font-semibold tracking-tight">TaskFlow</span>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent-light text-accent-dark"
                  : "text-muted hover:bg-line/50 hover:text-ink"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-card border border-dashed border-line p-3 text-xs text-muted">
        <p className="font-mono">v1.0.0</p>
        <p className="mt-1">Every task is scoped to your account only.</p>
      </div>
    </aside>
  );
}

function FolderIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M2.5 5.5a1 1 0 0 1 1-1h4l1.5 2h7.5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-9Z" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="10" cy="6.5" r="3" />
      <path d="M3.5 17c0-3 3-5 6.5-5s6.5 2 6.5 5" strokeLinecap="round" />
    </svg>
  );
}
