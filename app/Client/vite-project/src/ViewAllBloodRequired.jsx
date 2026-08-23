import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Heart, Phone, ArrowLeft, Droplet,
    Lock, AlertCircle, MapPin, Clock, User
} from "lucide-react";

const BASE_URL = "https://cravailable007.onrender.com/auth";

// Blood group badge — same as SearchValue
const BloodBadge = ({ group }) => (
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-lg">
        <span className="text-sm font-black text-white">{group || "?"}</span>
    </div>
);

// Info row — same pattern as SearchValue
const InfoRow = ({ icon: Icon, label, text }) => (
    <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            {Icon && <Icon className="w-4 h-4 text-red-400" />}
        </div>
        <div className="min-w-0">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-sm text-gray-800 dark:text-gray-100 font-semibold truncate">{text || "Not specified"}</p>
        </div>
    </div>
);

// Individual blood request card
const BloodRequestCard = ({ request, index }) => {
    const formattedDate = request.createdAt
        ? (() => {
            const d = new Date(request.createdAt);
            return isNaN(d)
                ? request.createdAt
                : d.toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                });
        })()
        : "Not specified";

    const urgencyColor =
        request.urgency === "critical"
            ? "bg-red-100 text-red-700 border-red-200"
            : request.urgency === "urgent"
                ? "bg-orange-100 text-orange-700 border-orange-200"
                : "bg-green-100 text-green-700 border-green-200";

    return (
        <div
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* Card Header */}
            <div className="flex items-center gap-4">
                <BloodBadge group={request.bloodGroup} />
                <div className="min-w-0 flex-1">
                    <p className="font-black text-gray-900 dark:text-white text-lg truncate">
                        {request.query || request.patientName || request.name || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-red-600">Needs Blood</span>
                        </div>
                        {request.urgency && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${urgencyColor}`}>
                                {request.urgency}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-dashed border-gray-200 dark:border-gray-700"></div>

            {/* Details */}
            <div className="flex flex-col gap-4">
                <InfoRow icon={MapPin} label="Hospital / Location" text={request.NearestHospital} />
                <InfoRow icon={User} label="Query / Reason" text={request.query} />
                <InfoRow icon={Clock} label="Date Posted" text={formattedDate} />
                <InfoRow icon={Phone} label="Contact" text={String(request.phone || "")} />
            </div>

            {/* CTA */}
            <a
                href={`tel:${request.phone}`}
                className="mt-auto w-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
                <Phone className="w-4 h-4" />
                <span>Contact Now</span>
            </a>
        </div>
    );
};

// Empty state — mirrors SearchValue's EmptyState
const EmptyState = ({ navigate }) => (
    <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 border-2 border-red-100">
            <Droplet className="w-12 h-12 text-red-300" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No requests found</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
            There are no active blood requests right now. Check back soon or post your own request.
        </p>
        <button
            onClick={() => navigate("/donate")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
            <Heart className="w-4 h-4 fill-current" />
            <span>Register as Donor</span>
        </button>
    </div>
);

// Login wall — mirrors SearchValue's LoginWall
const LoginWall = ({ navigate }) => (
    <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="bg-white/95 dark:bg-gray-950/95 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-12 max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Requests are locked</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                Login or create a free account to view blood requests, contact details, and locations.
            </p>
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                    Login
                </button>
                <button
                    onClick={() => navigate("/signup")}
                    className="w-full border-2 border-red-200 text-red-600 font-bold py-3 rounded-2xl hover:bg-red-50 transition-all"
                >
                    Sign Up — It's Free
                </button>
            </div>
        </div>
    </div>
);

const ViewAllBloodRequired = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        axios
            .get(`${BASE_URL}/dontaion/api/donation/api/getallbloodrequired`, { withCredentials: true })
            .then((res) => {
                const data = res.data?.findAll || res.data || [];
                setRequests(Array.isArray(data) ? data : []);
                setIsLoggedIn(true);
            })
            .catch((err) => {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    setIsLoggedIn(false);
                } else {
                    console.error("Failed to fetch blood requests", err);
                    setIsLoggedIn(true);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    // Loading spinner
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading blood requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-12">

            {/* Background blobs — same as SearchValue */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative max-w-6xl mx-auto">

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-600 font-semibold mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>

                {/* Login wall */}
                {!isLoggedIn ? (
                    <LoginWall navigate={navigate} />
                ) : (
                    <>
                        {/* Page header */}
                        <div className="flex flex-wrap items-center gap-4 mb-10">
                            <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl">
                                <Droplet className="w-7 h-7 text-white fill-current" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Blood Requests</h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                                    {requests.length > 0
                                        ? `${requests.length} active request${requests.length > 1 ? "s" : ""} — someone needs your help`
                                        : "No active requests right now"}
                                </p>
                            </div>
                            {requests.length > 0 && (
                                <span className="ml-auto bg-red-50 text-red-700 font-bold text-sm px-4 py-2 rounded-full border border-red-100">
                                    {requests.length} request{requests.length > 1 ? "s" : ""}
                                </span>
                            )}
                        </div>

                        {/* Privacy notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 mb-8">
                            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-800">
                                <strong>Urgent:</strong> These are real patients in need. Please contact them respectfully
                                and only if you can genuinely help.
                            </p>
                        </div>

                        {/* Empty or grid */}
                        {requests.length === 0 ? (
                            <EmptyState navigate={navigate} />
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {requests.map((req, index) => (
                                        <BloodRequestCard key={req._id || index} request={req} index={index} />
                                    ))}
                                </div>

                                {/* Footer CTA */}
                                <div className="mt-14 bg-gradient-to-br from-red-600 to-rose-600 rounded-3xl p-10 text-center text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full opacity-5 -mr-20 -mt-20"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full opacity-5 -ml-20 -mb-20"></div>
                                    <div className="relative">
                                        <h3 className="text-2xl font-black mb-2">Can you help save a life?</h3>
                                        <p className="text-red-100 mb-6 text-sm">
                                            Register as a donor and be ready when someone needs you most.
                                        </p>
                                        <button
                                            onClick={() => navigate("/donate")}
                                            className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            <Heart className="w-4 h-4 fill-current" />
                                            <span>Become a Donor</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(20px, -50px) scale(1.1); }
          50%  { transform: translate(-20px, 20px) scale(0.9); }
          75%  { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
        </div>
    );
};

export default ViewAllBloodRequired;