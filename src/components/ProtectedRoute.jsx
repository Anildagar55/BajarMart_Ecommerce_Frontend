import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// allowedRoles: array like ["ADMIN"] or ["SELLER","ADMIN"]. Empty/undefined = any logged-in user.
export default function ProtectedRoute({ children, allowedRoles, redirectTo = "/login" }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
