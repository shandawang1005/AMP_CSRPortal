import { Navigate } from "react-router-dom";

function LoginGuard({ children, user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default LoginGuard;
