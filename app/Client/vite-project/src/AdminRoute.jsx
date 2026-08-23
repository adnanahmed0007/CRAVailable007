import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { ShieldAlert, Loader2 } from "lucide-react";
import UserContext from "./Context1";

// Guards the /admin route: confirms the logged-in user's role is "admin"
// (via /auth/api/profile) before rendering the dashboard. Anyone else is
// redirected home with a friendly "access denied" message.
const AdminRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const [status, setStatus] = useState("checking"); // checking | allowed | denied

  useEffect(() => {
    if (!user) {
      setStatus("denied");
      return;
    }
    const checkRole = async () => {
      try {
        const res = await axios.get(
          " https://cravailable007.onrender.com/auth/api/profile",
          { withCredentials: true }
        );
        setStatus(res.data?.role === "admin" ? "allowed" : "denied");
      } catch {
        setStatus("denied");
      }
    };
    checkRole();
  }, [user]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
        <div className="text-center max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 border border-red-100 dark:border-gray-800">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Admins Only</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            You need admin access to view this page.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
