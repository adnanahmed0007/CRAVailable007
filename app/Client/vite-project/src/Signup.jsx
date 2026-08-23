import React, { useState } from "react";
import axios from "axios";

import { useNavigate, Link } from "react-router-dom";

import {
  User,
  Mail,
  Phone,
  Droplet,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Heart,
  UserPlus,
  Shield,
  KeyRound,
} from "lucide-react";

// ⚠️ Admin secret key — must match the one in Admin.jsx
const ADMIN_SECRET = "VishantSingh";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    age: "",
    password: "",
    role: "donor",
  });

  const [adminKey, setAdminKey] = useState("");
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [adminKeyError, setAdminKeyError] = useState("");
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

    // ── Admin key check ──────────────────────────────
    if (formData.role === "admin") {
      if (adminKey !== ADMIN_SECRET) {
        setAdminKeyError(
          "Incorrect admin secret key. Access denied."
        );
        return;
      }

      setAdminKeyError("");
    }

    setLoading(true);
    setMessage("All data looks good! ");

    try {
      const res = await axios.post(
        `http://localhost:9090/auth/api/signup`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log(res);

      setLoading(false);

      setTimeout(() => {
        if (formData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/", {
            state: {
              email: formData.email,
            },
          });
        }
      }, 2000);
    } catch (error) {
      setLoading(false);

      setMessage(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  const isAdmin = formData.role === "admin";

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-[#050d18] dark:via-[#091525] dark:to-[#0b1b30] px-4 py-12 transition-colors duration-300">

      {/* ===================================================== */}
      {/* BACKGROUND DECORATIONS */}
      {/* ===================================================== */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-400 dark:bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>

        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-400 dark:bg-cyan-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>

      </div>

      {/* ===================================================== */}
      {/* MAIN CONTAINER */}
      {/* ===================================================== */}

      <div className="relative w-full max-w-2xl z-10">

        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <div className="text-center mb-8">

          <div
            className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${isAdmin
              ? "from-purple-600 to-indigo-600"
              : "from-red-600 to-rose-600"
              } rounded-2xl shadow-xl mb-4 transition-all duration-500`}
          >
            {isAdmin ? (
              <Shield className="w-8 h-8 text-white" />
            ) : (
              <Heart className="w-8 h-8 text-white fill-current" />
            )}
          </div>

          <h1 className="text-4xl font-black text-gray-900 dark:text-[#e5f1ff] mb-2 transition-colors">
            {isAdmin
              ? "Create Admin Account"
              : "Join BloodConnect"}
          </h1>

          <p className="text-lg text-gray-600 dark:text-[#7893ad] transition-colors">

            {isAdmin ? (
              <>
                Admins manage donors, requests, and platform
                data.

                <br />

                <span className="font-semibold text-purple-600">
                  Full access. Full responsibility.
                </span>
              </>
            ) : (
              <>
                Your small step today can save a life tomorrow.

                <br />

                <span className="font-semibold text-red-600 dark:text-red-400">
                  Be a hero. Become a donor.
                </span>
              </>
            )}

          </p>

        </div>

        {/* ================================================= */}
        {/* SIGNUP CARD */}
        {/* ================================================= */}

        <div className="bg-white/90 dark:bg-[#0d1b2e]/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-red-100/40 dark:shadow-blue-950/40 p-8 md:p-10 border border-gray-200 dark:border-[#1e3a5f] transition-all duration-300">

          {/* ================================================= */}
          {/* ROLE TOGGLE */}
          {/* ================================================= */}

          <div className="flex bg-gray-100 dark:bg-[#10243d] border border-transparent dark:border-[#29496b] rounded-2xl p-1 mb-8">

            {/* DONOR */}

            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  role: "donor",
                });

                setAdminKey("");
                setAdminKeyError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${!isAdmin
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md"
                : "text-gray-500 dark:text-[#7893ad] hover:text-gray-700 dark:hover:text-[#b6cbe0]"
                }`}
            >

              <Heart
                className={`w-4 h-4 ${!isAdmin ? "fill-current" : ""
                  }`}
              />

              Sign up as Donor

            </button>

            {/* ADMIN */}

            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  role: "admin",
                });

                setAdminKey("");
                setAdminKeyError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${isAdmin
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                : "text-gray-500 dark:text-[#7893ad] hover:text-gray-700 dark:hover:text-[#b6cbe0]"
                }`}
            >

              <Shield className="w-4 h-4" />

              Sign up as Admin

            </button>

          </div>

          {/* ================================================= */}
          {/* ADMIN NOTICE + SECRET KEY */}
          {/* ================================================= */}

          {isAdmin && (
            <div className="mb-6 space-y-3">

              {/* Admin Notice */}

              <div className="p-4 bg-purple-50 dark:bg-[#21183a] border border-purple-200 dark:border-[#593d86] rounded-2xl flex items-start gap-3">

                <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />

                <div>

                  <p className="font-bold text-purple-800 dark:text-purple-300 text-sm">
                    Admin Account
                  </p>

                  <p className="text-xs text-purple-600 dark:text-purple-300 mt-0.5">
                    This account will have full access to manage
                    all donors, view reports, and moderate blood
                    requests. Blood group and age are optional
                    for admins.
                  </p>

                </div>

              </div>

              {/* Admin Secret Key */}

              <div className="space-y-2">

                <label className="block text-sm font-semibold text-gray-700 dark:text-[#c4d8ed] flex items-center gap-1.5">

                  <KeyRound className="w-4 h-4 text-purple-600" />

                  Admin Secret Key

                  <span className="text-red-500">*</span>

                </label>

                <div className="relative">

                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6f94b8]" />

                  <input
                    type={
                      showAdminKey
                        ? "text"
                        : "password"
                    }
                    value={adminKey}
                    onChange={(e) => {
                      setAdminKey(e.target.value);
                      setAdminKeyError("");
                    }}
                    className={`w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${adminKeyError
                      ? "border-red-400 bg-red-50 dark:bg-[#351524]"
                      : "border-gray-300 dark:border-[#29496b]"
                      }`}
                    placeholder="Enter admin secret key..."
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowAdminKey(!showAdminKey)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#6f94b8] hover:text-purple-600 transition-colors"
                  >
                    {showAdminKey ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>

                </div>

                {adminKeyError && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                    <span>⛔</span>
                    {adminKeyError}
                  </p>
                )}

              </div>

            </div>
          )}

          {/* ================================================= */}
          {/* DONOR BENEFITS */}
          {/* ================================================= */}

          {!isAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

              {[
                {
                  icon: Heart,
                  text: "Save Lives",
                },
                {
                  icon: Shield,
                  text: "Safe & Secure",
                },
                {
                  icon: UserPlus,
                  text: "Join 8,500+ Donors",
                },
              ].map((item, idx) => {

                const Icon = item.icon;

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-red-50 dark:bg-[#351526] border border-red-100 dark:border-[#713047] rounded-xl transition-colors duration-300"
                  >

                    <Icon className="w-5 h-5 text-red-600 dark:text-red-400" />

                    <span className="text-sm font-semibold text-gray-700 dark:text-[#a9c6df]">
                      {item.text}
                    </span>

                  </div>
                );
              })}

            </div>
          )}

          {/* ================================================= */}
          {/* MESSAGE */}
          {/* ================================================= */}

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl border ${loading
                ? "bg-blue-50 dark:bg-[#0b2945] border-blue-200 dark:border-[#1d5a88] text-blue-700 dark:text-[#a9d8ff]"
                : message.includes("wrong")
                  ? "bg-red-50 dark:bg-[#351524] border-red-200 dark:border-[#713047] text-red-700 dark:text-red-300"
                  : "bg-green-50 dark:bg-[#102f27] border-green-200 dark:border-[#245d4c] text-green-700 dark:text-green-300"
                }`}
            >

              <p className="font-medium text-center">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* ================================================= */}
              {/* NAME */}
              {/* ================================================= */}

              <div className="space-y-2">

                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 dark:text-[#c4d8ed]"
                >
                  Full Name
                </label>

                <div className="relative">

                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6f94b8]" />

                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] border border-gray-300 dark:border-[#29496b] rounded-xl focus:ring-2 ${isAdmin
                      ? "focus:ring-purple-500"
                      : "focus:ring-red-500"
                      } focus:border-transparent transition-all`}
                    placeholder="John Doe"
                    required
                  />

                </div>

              </div>

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

                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6f94b8]" />

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] border border-gray-300 dark:border-[#29496b] rounded-xl focus:ring-2 ${isAdmin
                      ? "focus:ring-purple-500"
                      : "focus:ring-red-500"
                      } focus:border-transparent transition-all`}
                    placeholder="you@example.com"
                    required
                  />

                </div>

              </div>

              {/* ================================================= */}
              {/* PHONE */}
              {/* ================================================= */}

              <div className="space-y-2">

                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 dark:text-[#c4d8ed]"
                >
                  Phone Number
                </label>

                <div className="relative">

                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6f94b8]" />

                  <input
                    type="number"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] border border-gray-300 dark:border-[#29496b] rounded-xl focus:ring-2 ${isAdmin
                      ? "focus:ring-purple-500"
                      : "focus:ring-red-500"
                      } focus:border-transparent transition-all`}
                    placeholder="1234567890"
                    required
                  />

                </div>

              </div>

              {/* ================================================= */}
              {/* BLOOD GROUP */}
              {/* ================================================= */}

              <div className="space-y-2">

                <label
                  htmlFor="bloodGroup"
                  className="block text-sm font-semibold text-gray-700 dark:text-[#c4d8ed]"
                >

                  Blood Group{" "}

                  {isAdmin && (
                    <span className="text-gray-400 dark:text-[#6685a3] font-normal">
                      (optional)
                    </span>
                  )}

                </label>

                <div className="relative">

                  <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6f94b8]" />

                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] border border-gray-300 dark:border-[#29496b] rounded-xl focus:ring-2 ${isAdmin
                      ? "focus:ring-purple-500"
                      : "focus:ring-red-500"
                      } focus:border-transparent transition-all appearance-none cursor-pointer`}
                    required={!isAdmin}
                  >

                    <option value="">
                      Select Blood Group
                    </option>

                    {[
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "O+",
                      "O-",
                      "AB+",
                      "AB-",
                    ].map((g) => (
                      <option
                        key={g}
                        value={g}
                      >
                        {g}
                      </option>
                    ))}

                  </select>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">

                    <svg
                      className="w-4 h-4 text-gray-400 dark:text-[#6f94b8]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />

                    </svg>

                  </div>

                </div>

              </div>

              {/* ================================================= */}
              {/* AGE */}
              {/* ================================================= */}

              <div className="space-y-2">

                <label
                  htmlFor="age"
                  className="block text-sm font-semibold text-gray-700 dark:text-[#c4d8ed]"
                >

                  Age{" "}

                  {isAdmin && (
                    <span className="text-gray-400 dark:text-[#6685a3] font-normal">
                      (optional)
                    </span>
                  )}

                </label>

                <div className="relative">

                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6f94b8]" />

                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] border border-gray-300 dark:border-[#29496b] rounded-xl focus:ring-2 ${isAdmin
                      ? "focus:ring-purple-500"
                      : "focus:ring-red-500"
                      } focus:border-transparent transition-all`}
                    placeholder="25"
                    min="18"
                    max="65"
                    required={!isAdmin}
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

                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6f94b8]" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] border border-gray-300 dark:border-[#29496b] rounded-xl focus:ring-2 ${isAdmin
                      ? "focus:ring-purple-500"
                      : "focus:ring-red-500"
                      } focus:border-transparent transition-all`}
                    placeholder="••••••••"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#6f94b8] hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >

                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}

                  </button>

                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* TERMS */}
            {/* ================================================= */}

            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-[#10243d] border border-transparent dark:border-[#1e3a5f] rounded-xl transition-colors">

              <input
                type="checkbox"
                id="terms"
                required
                className={`mt-1 w-4 h-4 border-gray-300 dark:border-[#29496b] rounded ${isAdmin
                  ? "text-purple-600 focus:ring-purple-500"
                  : "text-red-600 focus:ring-red-500"
                  }`}
              />

              <label
                htmlFor="terms"
                className="text-sm text-gray-600 dark:text-[#7893ad]"
              >

                I agree to the{" "}

                <a
                  href="#"
                  className={`font-semibold hover:underline ${isAdmin
                    ? "text-purple-600"
                    : "text-red-600 dark:text-red-400"
                    }`}
                >
                  Terms & Conditions
                </a>{" "}

                and{" "}

                <a
                  href="#"
                  className={`font-semibold hover:underline ${isAdmin
                    ? "text-purple-600"
                    : "text-red-600 dark:text-red-400"
                    }`}
                >
                  Privacy Policy
                </a>

              </label>

            </div>

            {/* ================================================= */}
            {/* SUBMIT */}
            {/* ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${isAdmin
                ? "from-purple-600 to-indigo-600"
                : "from-red-600 to-rose-600"
                } text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >

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

                  <span>
                    Processing...
                  </span>
                </>
              ) : isAdmin ? (
                <>
                  <Shield className="w-5 h-5" />

                  <span>
                    Create Admin Account
                  </span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />

                  <span>
                    Sign Up & Save Lives
                  </span>
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

              <span className="px-4 bg-white dark:bg-[#0d1b2e] text-gray-500 dark:text-[#7893ad]">
                Already have an account?
              </span>

            </div>

          </div>

          {/* ================================================= */}
          {/* LOGIN LINK */}
          {/* ================================================= */}

          <Link
            to="/login"
            className={`block w-full bg-white dark:bg-[#10243d] py-3 rounded-xl font-bold text-center border-2 transition-all duration-300 ${isAdmin
              ? "text-purple-600 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-[#21183a]"
              : "text-red-600 dark:text-red-400 border-red-200 dark:border-[#713047] hover:border-red-300 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-[#351526]"
              }`}
          >
            Login to Your Account
          </Link>

        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="text-center mt-6 space-y-2">

          <p className="text-sm text-gray-600 dark:text-[#7893ad]">

            Need help?{" "}

            <a
              href="#"
              className="font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              Contact Support
            </a>

          </p>

          <p className="text-xs text-gray-500 dark:text-[#6685a3]">

            By signing up, you agree to help save lives through
            blood donation

          </p>

        </div>

      </div>

      {/* ===================================================== */}
      {/* ANIMATIONS */}
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

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type=number] {
          -moz-appearance: textfield;
        }

      `}</style>

    </div>
  );
};

export default Signup;