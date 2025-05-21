import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authThunks";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };
  const handleClickApp = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center ">
      <div
        className="flex items-center gap-2 text-xl font-bold text-blue-600 cursor-pointer"
        onClick={handleClickApp}
      >
        <img
          src="./amp_memberships_logo.jpg"
          alt="AMP_LOGO"
          className="w-10 h-10 object-contain"
        />
        <span>CSR Portal</span>
      </div>

      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <span className="text-gray-700 font-medium">
              Hello, {user.name}
            </span>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
