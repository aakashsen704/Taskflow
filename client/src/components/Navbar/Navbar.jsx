import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function Navbar({ title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      navigate("/login");
    } catch {
      toast.error("Couldn't log out — try again");
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-line bg-paper px-6 py-4 md:px-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full border border-line bg-card px-2 py-1 pr-3 shadow-card transition-shadow hover:shadow-lift"
        >
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-light text-sm font-semibold text-accent-dark">
              {user?.name?.[0] ?? "?"}
            </span>
          )}
          <span className="text-sm font-medium text-ink">{user?.name?.split(" ")[0]}</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-card border border-line bg-card shadow-lift">
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/profile");
              }}
              className="block w-full px-4 py-2.5 text-left text-sm text-ink hover:bg-paper"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2.5 text-left text-sm text-high hover:bg-high-light"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
