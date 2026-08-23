import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Heart,
  Shield,
  Users,
} from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("Validating credentials ");

    try {
      const res = await axios.post(
        `http://localhost:9090/auth/api/login`,
        formData,
        {
          withCredentials: true,
        }
      );

      setLoading(false);
      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/", {
          state: {
            email: res.data.email,
          },
        });
      }, 2000);
    } catch (err) {
      setLoading(false);

      setMessage(
        err.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-[#050d18] dark:via-[#091525] dark:to-[#0b1b30] px-4 py-12 transition-colors duration-300">

      {/* ===================================================== */}
      {/* BACKGROUND DECORATIONS */}
      {/* ===================================================== */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-400 dark:bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>

        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-400 dark:bg-cyan-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>

      </div>

      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}

      <div className="relative w-full max-w-md z-10">

        {/* ================================================= */}
        {/* LOGO / BRAND */}
        {/* ================================================= */}

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl shadow-xl mb-4">

            <Heart className="w-8 h-8 text-white fill-current" />

          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-[#e5f1ff] transition-colors">
            Welcome Back
          </h1>

          <p className="text-gray-600 dark:text-[#7893ad] mt-2 transition-colors">
            Login to continue saving lives
          </p>

        </div>

        {/* ================================================= */}
        {/* LOGIN CARD */}
        {/* ================================================= */}

        <div className="relative bg-white/90 dark:bg-[#0d1b2e]/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-red-100/40 dark:shadow-blue-950/40 p-8 border border-gray-200 dark:border-[#1e3a5f] transition-all duration-300">

          {/* Top accent */}

          <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 rounded-b-full"></div>

          {/* ================================================= */}
          {/* BENEFITS BANNER */}
          {/* ================================================= */}

          <div className="grid grid-cols-3 gap-2 mb-6">

            {[
              {
                icon: Heart,
                text: "Save Lives",
              },
              {
                icon: Shield,
                text: "Secure",
              },
              {
                icon: Users,
                text: "8,500+",
              },
            ].map((item, idx) => {

              const Icon = item.icon;

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-1 p-3 bg-red-50 dark:bg-[#351526] border border-red-100 dark:border-[#713047] rounded-xl transition-colors duration-300"
                >

                  <Icon className="w-4 h-4 text-red-600 dark:text-red-400" />

                  <span className="text-xs font-semibold text-gray-700 dark:text-[#a9c6df]">
                    {item.text}
                  </span>

                </div>
              );
            })}

          </div>

          {/* ================================================= */}
          {/* MESSAGE DISPLAY */}
          {/* ================================================= */}

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl border transition-all ${loading
                ? "bg-blue-50 dark:bg-[#0b2945] border-blue-200 dark:border-[#1d5a88] text-blue-700 dark:text-[#a9d8ff]"
                : message.includes("wrong") ||
                  message.includes("failed")
                  ? "bg-red-50 dark:bg-[#351524] border-red-200 dark:border-[#713047] text-red-700 dark:text-red-300"
                  : "bg-green-50 dark:bg-[#102f27] border-green-200 dark:border-[#245d4c] text-green-700 dark:text-green-300"
                }`}
            >

              <p className="font-medium text-center text-sm">
                {message}
              </p>

            </div>
          )}

          {/* ================================================= */}
          {/* FORM */}
          {/* ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* ================================================= */}
            {/* EMAIL */}
            {/* ================================================= */}

            <div className="space-y-2">

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-[#c4d8ed]"
              >
                Email Address
              </label>

              <div className="relative">

                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6f94b8]" />

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] border border-gray-300 dark:border-[#29496b] rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  placeholder="you@example.com"
                  required
                />

              </div>

            </div>

            {/* ================================================= */}
            {/* PASSWORD */}
            {/* ================================================= */}

            <div className="space-y-2">

              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-[#c4d8ed]"
              >
                Password
              </label>

              <div className="relative">

                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6f94b8]" />

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] border border-gray-300 dark:border-[#29496b] rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-[#6f94b8] hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >

                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}

                </button>

              </div>

            </div>

            {/* ================================================= */}
            {/* FORGOT PASSWORD */}
            {/* ================================================= */}

            <div className="flex justify-end">

              <a
                href="#"
                className="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                Forgot password?
              </a>

            </div>

            {/* ================================================= */}
            {/* LOGIN BUTTON */}
            {/* ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="group relative overflow-hidden w-full bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-600 dark:to-red-700 text-white py-3 rounded-xl font-bold text-lg shadow-xl shadow-red-200/40 dark:shadow-red-950/40 hover:shadow-2xl hover:shadow-red-300/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >

              {/* Hover shine */}

              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700"></span>

              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >

                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>

                  </svg>

                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />

                  <span>Login</span>
                </>
              )}

            </button>

          </form>

          {/* ================================================= */}
          {/* DIVIDER */}
          {/* ================================================= */}

          <div className="relative my-6">

            <div className="absolute inset-0 flex items-center">

              <div className="w-full border-t border-gray-300 dark:border-[#29496b]"></div>

            </div>

            <div className="relative flex justify-center text-sm">

              <span className="px-4 bg-white dark:bg-[#0d1b2e] text-gray-500 dark:text-[#7893ad] transition-colors">
                Don't have an account?
              </span>

            </div>

          </div>

          {/* ================================================= */}
          {/* SIGNUP */}
          {/* ================================================= */}

          <Link
            to="/signup"
            className="block w-full bg-white dark:bg-[#10243d] text-red-600 dark:text-red-400 py-3 rounded-xl font-bold text-center border-2 border-red-200 dark:border-[#29496b] hover:border-red-300 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-[#173451] transition-all duration-300"
          >
            Create Account
          </Link>

        </div>

        {/* ================================================= */}
        {/* SUPPORT */}
        {/* ================================================= */}

        <p className="text-center text-sm text-gray-600 dark:text-[#7893ad] mt-6 transition-colors">

          Need help?{" "}

          <a
            href="#"
            className="font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            Contact Support
          </a>

        </p>

      </div>

      {/* ===================================================== */}
      {/* ANIMATION STYLES */}
      {/* ===================================================== */}

      <style>{`

        @keyframes blob {

          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          25% {
            transform: translate(20px, -50px) scale(1.1);
          }

          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }

          75% {
            transform: translate(50px, 50px) scale(1.05);
          }

        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

      `}</style>

    </div>
  );
};

export default Login;