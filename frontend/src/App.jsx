import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { fetchCurrentUser } from "./features/auth/authThunks";

import LoginGuard from "./guards/LoginGuard";
import ClientDetail from "./components/ClientDetail";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <main style={{ padding: "1rem" }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/client/:id" element={<ClientDetail />} />
            <Route
              path="/dashboard"
              element={
                <LoginGuard user={user}>
                  <Dashboard />
                </LoginGuard>
              }
            />

            {/* fallback route: anything else goes to NotFound */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}
