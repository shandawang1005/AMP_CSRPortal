import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Redirector() {
  const user = useSelector((state) => state.auth.user);
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}
