import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import UrlShortener from "./components/UrlShortner";
import Login from "./components/Login";
import Register from "./components/Register";
import MyUrls from "./components/MyUrls";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import "./css/app.css";

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        URL Shortener
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/my-urls">My URLs</Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<UrlShortener />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/my-urls"
                element={
                  <PrivateRoute>
                    <MyUrls />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
