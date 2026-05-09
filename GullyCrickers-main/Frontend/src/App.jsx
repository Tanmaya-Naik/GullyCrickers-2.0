import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./Components/Auth";
import MatchDashboard from "./Components/MatchDashboard";
import LiveMatch from "./Pages/LiveMatch";

function App() {

  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>

      <div className="min-h-screen bg-black text-white">

        <Routes>

          <Route
            path="/"
            element={
              <MatchDashboard
                token={token}
                onLogout={handleLogout}
              />
            }
          />

          <Route
            path="/match/:id"
            element={
              <LiveMatch
                token={token}
              />
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" />}
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;