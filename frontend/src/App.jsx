import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { fetchCurrentUser } from "./features/auth/authThunks";

import LoginGuard from "./guards/LoginGuard";
import ClientDetail from "./components/ClientDetail";
import TicketDetail from "./components/TicketDetail";
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

            {/* Protected routes group */}
            <Route element={<LoginGuard user={user} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/client/:id" element={<ClientDetail />} />
              <Route path="/tickets/:ticketId" element={<TicketDetail />} />
            </Route>

            {/* fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}
