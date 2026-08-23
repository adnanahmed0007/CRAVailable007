import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import axios from "axios"
import Home from "./Home"
import Donate from "./Donate"
import Signup from "./Signup"
import Login from "./Login"
import SearchBlood from "./SearchbLood"
import Header from "./Header"
import SearchValue from "./Searchvalue"
import Logout from "./Logout"
import ViewAllBloodRequired from "./ViewAllBloodRequired"
import Admin from "./Admin"
import AdminRoute from "./AdminRoute"
import UserContext from "./Context1"
import Profile from "./Profile"
import NearbyHospitals from "./NearbyHospitals"

const App = () => {
  const [user, setUser] = useState(() => {
    return localStorage.getItem("user") === "true";
  });

  const [loading, setLoading] = useState(true);

  // ✅ Check real session from backend on every refresh
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(
          "http://localhost:9090/auth/api/me",
          { withCredentials: true }
        );
        if (res.data.loggedIn) {
          setUser(true);
          localStorage.setItem("user", "true");
        } else {
          setUser(false);
          localStorage.setItem("user", "false");
        }
      } catch (err) {
        setUser(false);
        localStorage.setItem("user", "false");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // ✅ Wrap setUser to also update localStorage
  const handleSetUser = (value) => {
    setUser(value);
    localStorage.setItem("user", value);
  };

  // ⛔ Don't render app until session is verified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-red-600 dark:text-red-400 text-xl font-semibold transition-colors">
        Loading...
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser }}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<SearchBlood />} />
          <Route path="/results" element={<SearchValue />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/allviewblood" element={<ViewAllBloodRequired />} />
          <Route path="/nearby-hospitals" element={<NearbyHospitals />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
