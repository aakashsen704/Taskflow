// Wraps any route that requires a logged-in user. While we're still checking
// (loading), we show a spinner instead of flashing the login page. Once we
// know for sure there's no session, redirect — this is the frontend half of
// route protection; requireAuth on the backend is the half that actually
// matters for security.

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Spinner from "./Loader/Spinner.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
