import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
    LogOut,
    CheckCircle,
    AlertCircle,
    ShieldCheck,
} from "lucide-react";

const Logout = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await axios.get(
                `http://localhost:9090/auth/api/logout`,
                {
                    withCredentials: true,
                }
            );

            if (res.status === 200) {
                setIsError(false);
                setMessage("You have been successfully logged out.");

                setTimeout(() => {
                    navigate("/");
                }, 1000);
            }
        } catch (error) {
            console.error(error);

            setIsError(true);
            setMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-[#050d18] dark:via-[#091525] dark:to-[#0b1b30] flex items-center justify-center px-4 py-12 transition-colors duration-300">

            {/* ===================================================== */}
            {/* BACKGROUND GLOW */}
            {/* ===================================================== */}

            <div className="absolute inset-0 pointer-events-none overflow-hidden">

                <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-400 dark:bg-blue-500 rounded-full blur-3xl opacity-10 dark:opacity-15" />

                <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-rose-400 dark:bg-cyan-500 rounded-full blur-3xl opacity-10 dark:opacity-10" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-red-300 dark:bg-blue-600 rounded-full blur-3xl opacity-5 dark:opacity-10" />

            </div>

            {/* ===================================================== */}
            {/* MAIN CONTENT */}
            {/* ===================================================== */}

            <div className="relative z-10 w-full max-w-md">

                {/* Small top label */}

                <div className="flex justify-center mb-5">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-[#10243d]/80 border border-red-100 dark:border-[#29496b] shadow-sm backdrop-blur-md">

                        <ShieldCheck className="w-4 h-4 text-red-600 dark:text-blue-400" />

                        <span className="text-xs font-bold tracking-wide text-gray-600 dark:text-[#a9c6df]">
                            ACCOUNT SECURITY
                        </span>

                    </div>

                </div>

                {/* ================================================= */}
                {/* CARD */}
                {/* ================================================= */}

                <div className="relative bg-white/90 dark:bg-[#0d1b2e]/95 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-red-100/40 dark:shadow-blue-950/40 border border-red-100 dark:border-[#1e3a5f] p-8 sm:p-10 text-center transition-all duration-300">

                    {/* Top red line */}

                    <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 rounded-b-full" />

                    {/* ================================================= */}
                    {/* ICON */}
                    {/* ================================================= */}

                    <div className="flex justify-center mb-7">

                        <div className="relative">

                            {/* Glow */}

                            <div className="absolute inset-0 bg-red-500 dark:bg-red-600 rounded-full blur-xl opacity-20" />

                            {/* Icon Circle */}

                            <div className="relative w-24 h-24 bg-gradient-to-br from-red-50 to-rose-100 dark:from-[#351526] dark:to-[#40152a] border border-red-100 dark:border-[#713047] rounded-full flex items-center justify-center shadow-inner">

                                <LogOut className="w-10 h-10 text-red-600 dark:text-red-400" />

                            </div>

                            {/* Small dot */}

                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-[#0d1b2e] rounded-full flex items-center justify-center border border-red-100 dark:border-[#713047]">

                                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />

                            </div>

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* TITLE */}
                    {/* ================================================= */}

                    <div className="space-y-3 mb-8">

                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#e5f1ff]">

                            Leaving so{" "}

                            <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                                soon?
                            </span>

                        </h2>

                        <p className="text-sm sm:text-base text-gray-500 dark:text-[#91aec9] leading-relaxed max-w-sm mx-auto">
                            Are you sure you want to log out?
                            <br />
                            You will need to log in again to access your account.
                        </p>

                    </div>

                    {/* ================================================= */}
                    {/* LOGOUT BUTTON */}
                    {/* ================================================= */}

                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="group relative w-full overflow-hidden inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-700 hover:via-red-600 hover:to-rose-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-200/60 dark:shadow-red-950/40 hover:shadow-xl hover:shadow-red-300/50 dark:hover:shadow-red-950/60 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    >

                        {/* Hover shine */}

                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />

                        {loading ? (
                            <>
                                <svg
                                    className="w-5 h-5 animate-spin"
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
                                    />

                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    />
                                </svg>

                                <span>Logging out...</span>
                            </>
                        ) : (
                            <>
                                <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />

                                <span>Logout Securely</span>
                            </>
                        )}

                    </button>

                    {/* ================================================= */}
                    {/* MESSAGE */}
                    {/* ================================================= */}

                    {message && (
                        <div
                            className={`mt-5 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${isError
                                ? "bg-red-50 dark:bg-[#351524] text-red-700 dark:text-red-300 border border-red-200 dark:border-[#713047]"
                                : "bg-green-50 dark:bg-[#102f27] text-green-700 dark:text-green-300 border border-green-200 dark:border-[#245d4c]"
                                }`}
                        >

                            {isError ? (
                                <AlertCircle className="w-5 h-5 shrink-0" />
                            ) : (
                                <CheckCircle className="w-5 h-5 shrink-0" />
                            )}

                            <span>{message}</span>

                        </div>
                    )}

                    {/* ================================================= */}
                    {/* DIVIDER */}
                    {/* ================================================= */}

                    <div className="flex items-center gap-3 my-7">

                        <div className="h-px flex-1 bg-gray-200 dark:bg-[#1e3a5f]" />

                        <span className="text-xs text-gray-400 dark:text-[#6685a3]">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-gray-200 dark:bg-[#1e3a5f]" />

                    </div>

                    {/* ================================================= */}
                    {/* BACK HOME */}
                    {/* ================================================= */}

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-[#8eabc7] hover:text-red-600 dark:hover:text-red-400 font-semibold transition-colors duration-200"
                    >
                        ← Back to Home
                    </Link>

                </div>

                {/* ================================================= */}
                {/* BOTTOM TEXT */}
                {/* ================================================= */}

                <p className="text-center text-xs text-gray-400 dark:text-[#5f7f9d] mt-6">
                    Your account remains protected after logout.
                </p>

            </div>
        </div>
    );
};

export default Logout;