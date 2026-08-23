import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Heart, Droplet, Search, LogIn, UserPlus, LogOut, List, User, MapPin, Sun, Moon } from "lucide-react";
import { useContext } from "react";
import UserContext from "./Context1";
import { useTheme } from "./ThemeContext";

const Header = () => {
  const { user } = useContext(UserContext);
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/", icon: Heart },
    { name: "Find Blood", path: "/search", icon: Search },
    { name: "Donate", path: "/donate", icon: Droplet },
    { name: "Nearby Hospitals", path: "/nearby-hospitals", icon: MapPin },
    { name: "View Donations", path: "/results", icon: List },
    { name: "All Blood", path: "/allviewblood", icon: List },




  ];
  const authItems = [
    user && { name: "Profile", path: "/profile", icon: User },

    user ? { name: "Logout", path: "/logout", icon: LogOut }
      : { name: "Login", path: "/login", icon: LogIn },
    !user && { name: "Register", path: "/signup", icon: UserPlus },
  ].filter(Boolean);

  const ThemeToggle = ({ className = "" }) => (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 ${className}`}
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-xl shadow-red-100/50 dark:shadow-black/40"
          : "bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm"
          }`}
      >
        {/* Gradient top border — mirrors Home's red theme */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-rose-500 to-pink-500" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">

            {/* Logo — identical to Home's brand mark */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200 dark:shadow-red-950 group-hover:shadow-xl group-hover:shadow-red-300 dark:group-hover:shadow-red-900 transition-all duration-300 group-hover:-translate-y-0.5">
                  <Heart className="w-5 h-5 text-white fill-current" />
                </div>
                {/* Live indicator — same as Home */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-950 shadow-sm">
                  <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                </span>
              </div>
              <span className="text-2xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  Blood
                </span>
                <span className="text-gray-900 dark:text-white">Connect</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-200 dark:shadow-red-950"
                        : "text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggle />
              {authItems.map((item) => {
                const Icon = item.icon;
                const isSignup = item.path === "/signup";
                const isLogout = item.path === "/logout";
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${isSignup
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xl shadow-red-200 dark:shadow-red-950 hover:shadow-2xl hover:shadow-red-300 dark:hover:shadow-red-900 hover:-translate-y-0.5"
                        : isLogout
                          ? "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                          : isActive
                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg"
                            : "text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                aria-label="Toggle menu"
              >
                <span
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"
                    }`}
                />
                {isOpen ? (
                  <X className="w-5 h-5 relative text-white" />
                ) : (
                  <Menu className="w-5 h-5 relative" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="bg-white/98 dark:bg-gray-950/98 backdrop-blur-md border-t border-red-100 dark:border-gray-800 px-4 py-5 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${isActive
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-200 dark:shadow-red-950"
                      : "text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            <div className="border-t border-red-100 dark:border-gray-800 !my-3" />

            {authItems.map((item) => {
              const Icon = item.icon;
              const isSignup = item.path === "/signup";
              const isLogout = item.path === "/logout";
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 ${isSignup
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-200 dark:shadow-red-950"
                      : isLogout
                        ? "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        : isActive
                          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                          : "text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Spacer to offset fixed header */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Header;
