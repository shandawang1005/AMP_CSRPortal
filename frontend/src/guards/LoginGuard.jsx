import { Navigate, Outlet } from "react-router-dom";

function LoginGuard({ children, user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default LoginGuard;
