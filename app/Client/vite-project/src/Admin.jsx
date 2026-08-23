import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Heart, Users, Droplet, LogOut, Shield,
    Search, ChevronDown, Trash2, Eye, Bell, BarChart2,
    TrendingUp, CheckCircle, AlertCircle, X, Menu, HandHeart, Syringe,
    RefreshCw, WifiOff, Phone, MapPin, Hospital, Calendar, Hash,
    MessageSquare, User, UserPlus, Lock, Plus
} from "lucide-react";

const API_BASE = "https://cravailable007.onrender.com";
// ─── Helpers ──────────────────────────────────────────────────────────────────
const BloodBadge = ({ group }) => {
    const colors = {
        "A+": "bg-red-100 text-red-700 dark:bg-[#351526] dark:text-red-300",
        "A-": "bg-red-200 text-red-800 dark:bg-[#3f1620] dark:text-red-200",
        "B+": "bg-orange-100 text-orange-700 dark:bg-[#3a2410] dark:text-orange-300",
        "B-": "bg-orange-200 text-orange-800 dark:bg-[#432a10] dark:text-orange-200",
        "O+": "bg-rose-100 text-rose-700 dark:bg-[#351526] dark:text-rose-300",
        "O-": "bg-rose-200 text-rose-800 dark:bg-[#3f1620] dark:text-rose-200",
        "AB+": "bg-pink-100 text-pink-700 dark:bg-[#3a1530] dark:text-pink-300",
        "AB-": "bg-pink-200 text-pink-800 dark:bg-[#43163a] dark:text-pink-200",
    };
    return (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${colors[group] || "bg-gray-100 dark:bg-[#101f34] text-gray-600 dark:text-[#7893ad]"}`}>
            {group || "—"}
        </span>
    );
};

const RoleBadge = ({ role }) => (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold
    ${role === "admin" ? "bg-purple-100 text-purple-700 dark:bg-[#21183a] dark:text-purple-300" : "bg-green-100 text-green-700 dark:bg-[#102f27] dark:text-green-300"}`}>
        {role || "donor"}
    </span>
);

const StatusBadge = ({ status }) => {
    const map = {
        pending: "bg-yellow-100 text-yellow-700 dark:bg-[#3a2f10] dark:text-yellow-300",
        fulfilled: "bg-green-100 text-green-700 dark:bg-[#102f27] dark:text-green-300",
        urgent: "bg-red-100 text-red-700 dark:bg-[#351526] dark:text-red-300",
        completed: "bg-blue-100 text-blue-700 dark:bg-[#0b2945] dark:text-blue-300",
    };
    return (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${map[status?.toLowerCase()] || "bg-gray-100 dark:bg-[#101f34] text-gray-600 dark:text-[#7893ad]"}`}>
            {status || "pending"}
        </span>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white/80 dark:bg-[#0d1b2e]/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 dark:border-[#1e3a5f] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
        <p className="text-3xl font-black text-gray-900 dark:text-[#e5f1ff] mb-1">{value}</p>
        <p className="text-sm text-gray-500 dark:text-[#7893ad] font-medium">{label}</p>
    </div>
);

// ── Detail row inside modal ────────────────────────────────────────────────────
const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-start gap-3 p-3 bg-gray-50 dark:bg-[#101f34] rounded-xl">
        <span className="text-sm font-semibold text-gray-500 dark:text-[#7893ad] shrink-0">{label}</span>
        <span className="text-sm font-bold text-gray-800 dark:text-[#e5f1ff] text-right break-all">{value || "—"}</span>
    </div>
);

const Spinner = () => (
    <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    </div>
);

const ErrorState = ({ onRetry }) => (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 bg-red-50 dark:bg-[#351526] rounded-2xl flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-red-400 dark:text-red-300" />
        </div>
        <div className="text-center">
            <p className="font-bold text-gray-700 dark:text-[#c4d8ed] text-lg mb-1">Could not reach server</p>
            <p className="text-sm text-gray-400 dark:text-[#7893ad] mb-4">Make sure the backend is running and CORS is configured.</p>
            <button
                onClick={onRetry}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors mx-auto"
            >
                <RefreshCw className="w-4 h-4" /> Retry
            </button>
        </div>
    </div>
);

// ── Format date helper ─────────────────────────────────────────────────────────
const fmtDate = (val) => {
    if (!val) return "—";
    return new Date(val).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

// ── Format phone (API sends numbers, not strings) ─────────────────────────────
const fmtPhone = (val) => val ? String(val) : "—";

// ═══════════════════════════════════════════════════════════════════════════════
const Admin = () => {
    const [users, setUsers] = useState([]);
    const [bloodRequired, setBloodRequired] = useState([]);
    const [bloodDonation, setBloodDonation] = useState([]);

    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredRequired, setFilteredRequired] = useState([]);
    const [filteredDonation, setFilteredDonation] = useState([]);

    const [search, setSearch] = useState("");
    const [filterGroup, setFilterGroup] = useState("All");

    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedType, setSelectedType] = useState("");

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [notification, setNotification] = useState(null);

    const bloodGroups = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        setApiError(false);
        try {
            const res = await axios.get(
                `${API_BASE}/auth/dontaion/api/donation/api/getallusers`,
                { withCredentials: true }
            );
            const u = res.data.users || [];
            const br = res.data.bloodrequired || [];
            const bd = res.data.blooddonation || [];
            setUsers(u); setBloodRequired(br); setBloodDonation(bd);
            setFilteredUsers(u); setFilteredRequired(br); setFilteredDonation(bd);
        } catch (err) {
            console.error("API error:", err);
            setApiError(true);
        } finally {
            setLoading(false);
        }
    };

    // ── Filter ────────────────────────────────────────────────────────────────
    useEffect(() => {
        const s = search.toLowerCase();

        // users have: name, email, phone (number)
        setFilteredUsers(users.filter(u =>
            (!s || u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s) || String(u.phone || "").includes(s)) &&
            (filterGroup === "All" || u.bloodGroup === filterGroup)
        ));

        // bloodrequired has: NearestHospital, query, phone (number), bloodGroup — NO name field
        setFilteredRequired(bloodRequired.filter(r =>
            (!s || r.NearestHospital?.toLowerCase().includes(s) || r.query?.toLowerCase().includes(s) || String(r.phone || "").includes(s)) &&
            (filterGroup === "All" || r.bloodGroup === filterGroup)
        ));

        // blooddonation has: Address, NearestHospital, phoneNumber (number), bloodGroup — NO name field
        setFilteredDonation(bloodDonation.filter(d =>
            (!s || d.Address?.toLowerCase().includes(s) || d.NearestHospital?.toLowerCase().includes(s) || String(d.phoneNumber || "").includes(s)) &&
            (filterGroup === "All" || d.bloodGroup === filterGroup)
        ));
    }, [search, filterGroup, users, bloodRequired, bloodDonation]);

    const showNotification = (msg, type = "success") => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // ── Delete handlers ───────────────────────────────────────────────────────
    const handleDeleteUser = async (id) => {
        if (!window.confirm("Remove this user?")) return;
        try {
            await axios.delete(`${API_BASE}/auth/dontaion/api/donation/api/admin/user/${id}`, { withCredentials: true });
            setUsers(p => p.filter(u => u._id !== id));
            showNotification("User removed");
        } catch (err) {
            showNotification(err.response?.data?.message || "Failed to delete user", "error");
        }
    };

    const handleDeleteRequired = async (id) => {
        if (!window.confirm("Remove this blood request?")) return;
        try {
            await axios.delete(`${API_BASE}/auth/dontaion/api/donation/api/admin/bloodrequired/${id}`, { withCredentials: true });
            setBloodRequired(p => p.filter(r => r._id !== id));
            showNotification("Blood request removed");
        } catch (err) {
            showNotification(err.response?.data?.message || "Failed to delete request", "error");
        }
    };

    const handleDeleteDonation = async (id) => {
        if (!window.confirm("Remove this donation record?")) return;
        try {
            await axios.delete(`${API_BASE}/auth/dontaion/api/donation/api/admin/donation/${id}`, { withCredentials: true });
            setBloodDonation(p => p.filter(d => d._id !== id));
            showNotification("Donation record removed");
        } catch (err) {
            showNotification(err.response?.data?.message || "Failed to delete record", "error");
        }
    };

    // ── Add user (directly, by admin) ───────────────────────────────────────
    const [showAddUser, setShowAddUser] = useState(false);
    const [addUserForm, setAddUserForm] = useState({
        name: "", email: "", phone: "", age: "", bloodGroup: "A+", password: "", role: "donor",
    });
    const [addUserError, setAddUserError] = useState("");
    const [addUserLoading, setAddUserLoading] = useState(false);

    const handleAddUserChange = (e) => {
        setAddUserForm(p => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleAddUserSubmit = async (e) => {
        e.preventDefault();
        setAddUserError("");
        setAddUserLoading(true);
        try {
            const res = await axios.post(
                `${API_BASE}/auth/dontaion/api/donation/api/admin/user`,
                {
                    ...addUserForm,
                    phone: Number(addUserForm.phone),
                    age: Number(addUserForm.age),
                },
                { withCredentials: true }
            );
            setUsers(p => [res.data.user, ...p]);
            showNotification("User added successfully");
            setShowAddUser(false);
            setAddUserForm({ name: "", email: "", phone: "", age: "", bloodGroup: "A+", password: "", role: "donor" });
        } catch (err) {
            setAddUserError(err.response?.data?.message || "Failed to add user");
        } finally {
            setAddUserLoading(false);
        }
    };

    const stats = [
        { icon: Users, label: "Total Users", value: users.length, color: "bg-gradient-to-br from-red-500 to-rose-600" },
        { icon: Droplet, label: "Blood Requests", value: bloodRequired.length, color: "bg-gradient-to-br from-orange-500 to-red-500" },
        { icon: Syringe, label: "Willing Donors", value: bloodDonation.length, color: "bg-gradient-to-br from-pink-500 to-rose-500" },
        { icon: CheckCircle, label: "Fulfilled Requests", value: bloodRequired.filter(r => r.status === "fulfilled").length, color: "bg-gradient-to-br from-red-600 to-pink-600" },
    ];

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: BarChart2 },
        { id: "users", label: "All Users", icon: Users },
        { id: "requests", label: "Blood Requests", icon: Droplet },
        { id: "donations", label: "Willing Donors", icon: HandHeart },
    ];

    const FilterBar = ({ placeholder }) => (
        <div className="flex gap-3 flex-wrap">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#6f94b8]" />
                <input
                    type="text" placeholder={placeholder || "Search..."} value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] border border-gray-200 dark:border-[#29496b] rounded-xl text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all w-56"
                />
            </div>
            <div className="relative">
                <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#6f94b8]" />
                <select
                    value={filterGroup} onChange={e => setFilterGroup(e.target.value)}
                    className="pl-9 pr-8 py-2 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] border border-gray-200 dark:border-[#29496b] rounded-xl text-sm font-semibold focus:ring-2 focus:ring-red-400 appearance-none cursor-pointer"
                >
                    {bloodGroups.map(g => <option key={g}>{g}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#6f94b8] pointer-events-none" />
            </div>
        </div>
    );

    const tabTitles = {
        dashboard: "Dashboard", users: "All Users",
        requests: "Blood Requests", donations: "Willing Donors",
    };

    // ── Modal field definitions using REAL field names from API ───────────────
    const getModalFields = () => {
        if (selectedType === "user") return [
            { label: "Full Name", value: selectedItem.name },
            { label: "Email", value: selectedItem.email },
            { label: "Phone", value: fmtPhone(selectedItem.phone) },
            { label: "Age", value: selectedItem.age ? `${selectedItem.age} years` : null },
            { label: "Blood Group", value: selectedItem.bloodGroup },
            { label: "Role", value: selectedItem.role || "donor" },
            { label: "Registered", value: fmtDate(selectedItem.createdAt) },
            { label: "User ID", value: selectedItem._id },
        ];
        if (selectedType === "required") return [
            { label: "Blood Group", value: selectedItem.bloodGroup },
            { label: "Phone", value: fmtPhone(selectedItem.phone) },
            { label: "Nearest Hospital", value: selectedItem.NearestHospital },
            { label: "Query / Reason", value: selectedItem.query },
            { label: "Status", value: selectedItem.status || "pending" },
            { label: "Requested On", value: fmtDate(selectedItem.createdAt) },
            { label: "Record ID", value: selectedItem._id },
        ];
        // blooddonation
        return [
            { label: "Blood Group", value: selectedItem.bloodGroup },
            { label: "Phone Number", value: fmtPhone(selectedItem.phoneNumber) },
            { label: "Address", value: selectedItem.Address },
            { label: "Nearest Hospital", value: selectedItem.NearestHospital },
            { label: "Preferred Date", value: fmtDate(selectedItem.Registerday) },
            { label: "Status", value: selectedItem.status || "pending" },
            { label: "Registered On", value: fmtDate(selectedItem.createdAt) },
            { label: "Donor User ID", value: selectedItem.UserIdinf },
            { label: "Record ID", value: selectedItem._id },
        ];
    };

    // ── Avatar initial (donation/request have no name) ─────────────────────────
    const getInitial = (item, type) => {
        if (type === "user") return item.name?.charAt(0)?.toUpperCase() || "U";
        if (type === "required") return item.bloodGroup?.charAt(0) || "B";
        return item.bloodGroup?.charAt(0) || "D";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-[#050d18] dark:via-[#091525] dark:to-[#0b1b30] flex transition-colors duration-300">

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
            </div>

            {/* ── Sidebar ── */}
            <aside className={`${sidebarOpen ? "w-64" : "w-20"} relative z-10 transition-all duration-300 bg-white/90 dark:bg-[#0d1b2e]/95 backdrop-blur-lg border-r border-gray-200 dark:border-[#1e3a5f] flex flex-col shadow-xl min-h-screen`}>
                <div className="p-6 border-b border-gray-100 dark:border-[#1e3a5f]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <Heart className="w-5 h-5 text-white fill-current" />
                        </div>
                        {sidebarOpen && (
                            <div>
                                <p className="font-black text-gray-900 dark:text-[#e5f1ff] text-sm leading-tight">BloodConnect</p>
                                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">Admin Panel</p>
                            </div>
                        )}
                    </div>
                </div>

                {sidebarOpen && (
                    <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-red-50 to-rose-50 dark:from-[#351526] dark:to-[#2a1220] rounded-xl border border-red-100 dark:border-[#713047]">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <div>
                                <p className="text-xs font-bold text-gray-800 dark:text-[#e5f1ff]">Admin Access</p>
                                <p className="text-xs text-gray-500 dark:text-[#7893ad]">Full Permissions</p>
                            </div>
                        </div>
                    </div>
                )}

                <nav className="flex-1 p-4 space-y-1 mt-2">
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id} onClick={() => setActiveTab(id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-semibold text-sm
                                ${activeTab === id
                                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md"
                                    : "text-gray-600 dark:text-[#7893ad] hover:bg-red-50 dark:hover:bg-[#351526] hover:text-red-600 dark:hover:text-red-400"}`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span>{label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-[#1e3a5f]">
                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 dark:text-[#7893ad] hover:bg-red-50 dark:hover:bg-[#351526] hover:text-red-600 dark:hover:text-red-400 transition-all font-semibold text-sm">
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 dark:bg-[#0d1b2e]/95 backdrop-blur-lg border-b border-gray-200 dark:border-[#1e3a5f] px-6 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#101f34] transition-colors">
                            <Menu className="w-5 h-5 text-gray-600 dark:text-[#7893ad]" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 dark:text-[#e5f1ff]">{tabTitles[activeTab]}</h1>
                            <p className="text-xs text-gray-500 dark:text-[#7893ad]">Welcome back, Admin</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchAll} title="Refresh data" className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-[#351526] transition-colors">
                            <RefreshCw className="w-5 h-5 text-gray-600 dark:text-[#7893ad]" />
                        </button>
                        <button className="relative p-2 rounded-xl hover:bg-red-50 dark:hover:bg-[#351526] transition-colors">
                            <Bell className="w-5 h-5 text-gray-600 dark:text-[#7893ad]" />
                            {bloodRequired.filter(r => r.status === "urgent").length > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            )}
                        </button>
                        <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Notification toast */}
                    {notification && (
                        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white font-semibold text-sm
                            ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
                            <CheckCircle className="w-4 h-4" />
                            {notification.msg}
                            <button onClick={() => setNotification(null)}><X className="w-4 h-4" /></button>
                        </div>
                    )}

                    {/* API Error banner */}
                    {apiError && !loading && (
                        <div className="bg-red-50 dark:bg-[#351526] border border-red-200 dark:border-[#713047] rounded-2xl px-5 py-3 flex items-center gap-3 text-red-700 dark:text-red-300 text-sm font-medium">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>Could not connect to API. Check your backend and CORS settings.</span>
                            <button onClick={fetchAll} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors">
                                <RefreshCw className="w-3 h-3" /> Retry
                            </button>
                        </div>
                    )}

                    {/* ── DASHBOARD ── */}
                    {activeTab === "dashboard" && (
                        <>
                            {loading ? <Spinner /> : apiError ? <ErrorState onRetry={fetchAll} /> : (
                                <>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {stats.map((s, i) => <StatCard key={i} {...s} />)}
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                        {/* Recent Users */}
                                        <div className="bg-white/80 dark:bg-[#0d1b2e]/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 dark:border-[#1e3a5f] p-5">
                                            <h3 className="font-black text-gray-900 dark:text-[#e5f1ff] mb-4 flex items-center gap-2 text-sm">
                                                <Users className="w-4 h-4 text-red-600 dark:text-red-400" /> Recent Users
                                            </h3>
                                            {users.length === 0 ? (
                                                <p className="text-xs text-gray-400 dark:text-[#6685a3] text-center py-6">No users yet</p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {users.slice(0, 4).map(u => (
                                                        <div key={u._id} className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                                                {u.name?.charAt(0)?.toUpperCase() || "?"}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-gray-800 dark:text-[#e5f1ff] truncate">{u.name}</p>
                                                                <p className="text-xs text-gray-400 dark:text-[#7893ad] truncate">{u.email}</p>
                                                            </div>
                                                            <BloodBadge group={u.bloodGroup} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <button onClick={() => setActiveTab("users")} className="w-full mt-4 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-center">
                                                View all ({users.length}) →
                                            </button>
                                        </div>

                                        {/* Recent Blood Requests — no name, show blood group + hospital */}
                                        <div className="bg-white/80 dark:bg-[#0d1b2e]/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 dark:border-[#1e3a5f] p-5">
                                            <h3 className="font-black text-gray-900 dark:text-[#e5f1ff] mb-4 flex items-center gap-2 text-sm">
                                                <Droplet className="w-4 h-4 text-orange-600 dark:text-orange-400" /> Recent Requests
                                            </h3>
                                            {bloodRequired.length === 0 ? (
                                                <p className="text-xs text-gray-400 dark:text-[#6685a3] text-center py-6">No requests yet</p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {bloodRequired.slice(0, 4).map(r => (
                                                        <div key={r._id} className="flex items-center gap-3">
                                                            <BloodBadge group={r.bloodGroup} />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-gray-800 dark:text-[#e5f1ff] truncate">{r.NearestHospital || "Hospital not specified"}</p>
                                                                <p className="text-xs text-gray-400 dark:text-[#7893ad] truncate">{fmtPhone(r.phone)}</p>
                                                            </div>
                                                            <StatusBadge status={r.status} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <button onClick={() => setActiveTab("requests")} className="w-full mt-4 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-center">
                                                View all ({bloodRequired.length}) →
                                            </button>
                                        </div>

                                        {/* Willing Donors — no name, show address + hospital */}
                                        <div className="bg-white/80 dark:bg-[#0d1b2e]/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 dark:border-[#1e3a5f] p-5">
                                            <h3 className="font-black text-gray-900 dark:text-[#e5f1ff] mb-4 flex items-center gap-2 text-sm">
                                                <HandHeart className="w-4 h-4 text-pink-600 dark:text-pink-400" /> Willing Donors
                                            </h3>
                                            {bloodDonation.length === 0 ? (
                                                <p className="text-xs text-gray-400 dark:text-[#6685a3] text-center py-6">No donors yet</p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {bloodDonation.slice(0, 4).map(d => (
                                                        <div key={d._id} className="flex items-center gap-3">
                                                            <BloodBadge group={d.bloodGroup} />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-gray-800 dark:text-[#e5f1ff] truncate">{d.Address || "Address not provided"}</p>
                                                                <p className="text-xs text-gray-400 dark:text-[#7893ad] truncate">{d.NearestHospital || "—"}</p>
                                                            </div>
                                                            <StatusBadge status={d.status} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <button onClick={() => setActiveTab("donations")} className="w-full mt-4 text-xs font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 text-center">
                                                View all ({bloodDonation.length}) →
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* ── ALL USERS ── */}
                    {activeTab === "users" && (
                        <div className="bg-white/80 dark:bg-[#0d1b2e]/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 dark:border-[#1e3a5f] overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-[#1e3a5f] flex flex-col md:flex-row gap-4 md:items-center justify-between">
                                <h2 className="text-lg font-black text-gray-900 dark:text-[#e5f1ff] flex items-center gap-2">
                                    <Users className="w-5 h-5 text-red-600 dark:text-red-400" /> All Users
                                    <span className="bg-red-100 dark:bg-[#351526] text-red-700 dark:text-red-300 text-xs font-bold px-2 py-0.5 rounded-full">{filteredUsers.length}</span>
                                </h2>
                                <div className="flex gap-3 flex-wrap items-center">
                                    <FilterBar placeholder="Search name, email, phone..." />
                                    <button
                                        onClick={() => setShowAddUser(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <UserPlus className="w-4 h-4" /> Add User
                                    </button>
                                </div>
                            </div>
                            {loading ? <Spinner /> : apiError ? <ErrorState onRetry={fetchAll} /> : filteredUsers.length === 0 ? (
                                <div className="text-center py-20 text-gray-400 dark:text-[#6685a3]">
                                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="font-semibold">{search || filterGroup !== "All" ? "No matching users" : "No users found"}</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50/80 dark:bg-[#10243d]/70 text-left">
                                                {["User", "Email", "Phone", "Blood Group", "Age", "Role", "Registered", "Actions"].map(h => (
                                                    <th key={h} className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-[#7893ad] uppercase tracking-wider whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-[#1e3a5f]">
                                            {filteredUsers.map(u => (
                                                <tr key={u._id} className="hover:bg-red-50/30 dark:hover:bg-[#351526]/30 transition-colors group">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                                {u.name?.charAt(0)?.toUpperCase() || "?"}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900 dark:text-[#e5f1ff] text-sm whitespace-nowrap">{u.name}</p>
                                                                <p className="text-xs text-gray-400 dark:text-[#6685a3] font-mono">{u._id?.slice(-6)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-[#c4d8ed]">{u.email}</td>
                                                    {/* phone comes as a number from API */}
                                                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-[#c4d8ed] font-mono">{fmtPhone(u.phone)}</td>
                                                    <td className="px-5 py-4"><BloodBadge group={u.bloodGroup} /></td>
                                                    <td className="px-5 py-4 text-sm font-semibold text-gray-700 dark:text-[#c4d8ed]">{u.age ? `${u.age} yrs` : "—"}</td>
                                                    <td className="px-5 py-4"><RoleBadge role={u.role} /></td>
                                                    <td className="px-5 py-4 text-xs text-gray-500 dark:text-[#7893ad] whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => { setSelectedItem(u); setSelectedType("user"); }} className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-[#0b2945] text-blue-600 dark:text-blue-300 transition-colors">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDeleteUser(u._id)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-[#351526] text-red-600 dark:text-red-300 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── BLOOD REQUESTS ── */}
                    {activeTab === "requests" && (
                        <div className="bg-white/80 dark:bg-[#0d1b2e]/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 dark:border-[#1e3a5f] overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-[#1e3a5f] flex flex-col md:flex-row gap-4 md:items-center justify-between">
                                <h2 className="text-lg font-black text-gray-900 dark:text-[#e5f1ff] flex items-center gap-2">
                                    <Droplet className="w-5 h-5 text-orange-600 dark:text-orange-400" /> Blood Requests
                                    <span className="bg-orange-100 dark:bg-[#3a2410] text-orange-700 dark:text-orange-300 text-xs font-bold px-2 py-0.5 rounded-full">{filteredRequired.length}</span>
                                </h2>
                                <FilterBar placeholder="Search hospital, phone, query..." />
                            </div>
                            {loading ? <Spinner /> : apiError ? <ErrorState onRetry={fetchAll} /> : filteredRequired.length === 0 ? (
                                <div className="text-center py-20 text-gray-400 dark:text-[#6685a3]">
                                    <Droplet className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="font-semibold">{search || filterGroup !== "All" ? "No matching requests" : "No requests found"}</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50/80 dark:bg-[#10243d]/70 text-left">
                                                {["Blood Group", "Phone", "Nearest Hospital", "Query / Reason", "Status", "Requested On", "Actions"].map(h => (
                                                    <th key={h} className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-[#7893ad] uppercase tracking-wider whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-[#1e3a5f]">
                                            {filteredRequired.map(r => (
                                                <tr key={r._id} className="hover:bg-orange-50/30 dark:hover:bg-[#3a2410]/30 transition-colors group">
                                                    <td className="px-5 py-4"><BloodBadge group={r.bloodGroup} /></td>
                                                    {/* phone is a number in bloodrequired */}
                                                    <td className="px-5 py-4 text-sm font-mono text-gray-700 dark:text-[#c4d8ed]">{fmtPhone(r.phone)}</td>
                                                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-[#c4d8ed]">{r.NearestHospital || "—"}</td>
                                                    {/* query is the reason/message field */}
                                                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-[#a9c6df] max-w-xs">
                                                        <p className="truncate" title={r.query}>{r.query || "—"}</p>
                                                    </td>
                                                    <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                                                    <td className="px-5 py-4 text-xs text-gray-500 dark:text-[#7893ad] whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => { setSelectedItem(r); setSelectedType("required"); }} className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-[#0b2945] text-blue-600 dark:text-blue-300 transition-colors">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDeleteRequired(r._id)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-[#351526] text-red-600 dark:text-red-300 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── WILLING DONORS ── */}
                    {activeTab === "donations" && (
                        <div className="bg-white/80 dark:bg-[#0d1b2e]/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 dark:border-[#1e3a5f] overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-[#1e3a5f] flex flex-col md:flex-row gap-4 md:items-center justify-between">
                                <h2 className="text-lg font-black text-gray-900 dark:text-[#e5f1ff] flex items-center gap-2">
                                    <HandHeart className="w-5 h-5 text-pink-600 dark:text-pink-400" /> Willing Donors
                                    <span className="bg-pink-100 dark:bg-[#3a1530] text-pink-700 dark:text-pink-300 text-xs font-bold px-2 py-0.5 rounded-full">{filteredDonation.length}</span>
                                </h2>
                                <FilterBar placeholder="Search address, hospital, phone..." />
                            </div>
                            {loading ? <Spinner /> : apiError ? <ErrorState onRetry={fetchAll} /> : filteredDonation.length === 0 ? (
                                <div className="text-center py-20 text-gray-400 dark:text-[#6685a3]">
                                    <HandHeart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="font-semibold">{search || filterGroup !== "All" ? "No matching donors" : "No donation records found"}</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50/80 dark:bg-[#10243d]/70 text-left">
                                                {["Blood Group", "Phone", "Address", "Nearest Hospital", "Preferred Date", "Registered On", "Status", "Actions"].map(h => (
                                                    <th key={h} className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-[#7893ad] uppercase tracking-wider whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-[#1e3a5f]">
                                            {filteredDonation.map(d => (
                                                <tr key={d._id} className="hover:bg-pink-50/30 dark:hover:bg-[#3a1530]/30 transition-colors group">
                                                    <td className="px-5 py-4"><BloodBadge group={d.bloodGroup} /></td>
                                                    {/* phoneNumber (not phone) for blooddonation */}
                                                    <td className="px-5 py-4 text-sm font-mono text-gray-700 dark:text-[#c4d8ed]">{fmtPhone(d.phoneNumber)}</td>
                                                    {/* Address (capital A) is the location field */}
                                                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-[#c4d8ed]">{d.Address || "—"}</td>
                                                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-[#c4d8ed]">{d.NearestHospital || "—"}</td>
                                                    {/* Registerday is the preferred donation date */}
                                                    <td className="px-5 py-4 text-xs text-gray-500 dark:text-[#7893ad] whitespace-nowrap">{fmtDate(d.Registerday)}</td>
                                                    <td className="px-5 py-4 text-xs text-gray-500 dark:text-[#7893ad] whitespace-nowrap">{fmtDate(d.createdAt)}</td>
                                                    <td className="px-5 py-4"><StatusBadge status={d.status} /></td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => { setSelectedItem(d); setSelectedType("donation"); }} className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-[#0b2945] text-blue-600 dark:text-blue-300 transition-colors">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDeleteDonation(d._id)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-[#351526] text-red-600 dark:text-red-300 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </main>

            {/* ── Add User Modal ── */}
            {showAddUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#0d1b2e] rounded-3xl shadow-2xl w-full max-w-md p-8 relative max-h-[90vh] overflow-y-auto border border-transparent dark:border-[#1e3a5f]">
                        <button onClick={() => setShowAddUser(false)} className="absolute top-5 right-5 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#101f34] transition-colors">
                            <X className="w-5 h-5 text-gray-500 dark:text-[#7893ad]" />
                        </button>
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <UserPlus className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-[#e5f1ff]">Add New User</h3>
                            <p className="text-sm text-gray-400 dark:text-[#7893ad] mt-1">Creates the account directly — they can log in right away.</p>
                        </div>

                        {addUserError && (
                            <div className="mb-4 flex items-center gap-2 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-[#351524] border border-red-200 dark:border-[#713047] rounded-xl px-4 py-3">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{addUserError}</span>
                            </div>
                        )}

                        <form onSubmit={handleAddUserSubmit} className="space-y-3">
                            <input
                                type="text" name="name" placeholder="Full name" required
                                value={addUserForm.name} onChange={handleAddUserChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#101f34] border border-gray-200 dark:border-[#29496b] rounded-xl text-sm text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                            />
                            <input
                                type="email" name="email" placeholder="Email address" required
                                value={addUserForm.email} onChange={handleAddUserChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#101f34] border border-gray-200 dark:border-[#29496b] rounded-xl text-sm text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="tel" name="phone" placeholder="Phone (10 digits)" required
                                    value={addUserForm.phone} onChange={handleAddUserChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#101f34] border border-gray-200 dark:border-[#29496b] rounded-xl text-sm text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                                />
                                <input
                                    type="number" name="age" placeholder="Age" required min="18" max="65"
                                    value={addUserForm.age} onChange={handleAddUserChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#101f34] border border-gray-200 dark:border-[#29496b] rounded-xl text-sm text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    name="bloodGroup" value={addUserForm.bloodGroup} onChange={handleAddUserChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#101f34] border border-gray-200 dark:border-[#29496b] rounded-xl text-sm font-semibold text-gray-900 dark:text-[#e5f1ff] focus:ring-2 focus:ring-red-400 transition-all"
                                >
                                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                                <select
                                    name="role" value={addUserForm.role} onChange={handleAddUserChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#101f34] border border-gray-200 dark:border-[#29496b] rounded-xl text-sm font-semibold text-gray-900 dark:text-[#e5f1ff] focus:ring-2 focus:ring-red-400 transition-all"
                                >
                                    <option value="donor">Donor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#6f94b8]" />
                                <input
                                    type="password" name="password" placeholder="Temporary password" required minLength={4}
                                    value={addUserForm.password} onChange={handleAddUserChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#101f34] border border-gray-200 dark:border-[#29496b] rounded-xl text-sm text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                                />
                            </div>

                            <button
                                type="submit" disabled={addUserLoading}
                                className="w-full mt-2 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                <Plus className="w-4 h-4" /> {addUserLoading ? "Creating..." : "Create User"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Detail Modal ── */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#0d1b2e] rounded-3xl shadow-2xl w-full max-w-md p-8 relative max-h-[90vh] overflow-y-auto border border-transparent dark:border-[#1e3a5f]">
                        <button onClick={() => setSelectedItem(null)} className="absolute top-5 right-5 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#101f34] transition-colors">
                            <X className="w-5 h-5 text-gray-500 dark:text-[#7893ad]" />
                        </button>
                        <div className="text-center mb-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-3 shadow-lg
                                ${selectedType === "user"
                                    ? "bg-gradient-to-br from-red-500 to-rose-600"
                                    : selectedType === "required"
                                        ? "bg-gradient-to-br from-orange-500 to-red-500"
                                        : "bg-gradient-to-br from-pink-500 to-rose-500"}`}>
                                {getInitial(selectedItem, selectedType)}
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-[#e5f1ff]">
                                {selectedType === "user"
                                    ? selectedItem.name
                                    : selectedType === "required"
                                        ? `${selectedItem.bloodGroup} Request`
                                        : `${selectedItem.bloodGroup} Donor`}
                            </h3>
                            {selectedItem.bloodGroup && (
                                <div className="mt-2"><BloodBadge group={selectedItem.bloodGroup} /></div>
                            )}
                        </div>

                        <div className="space-y-2">
                            {getModalFields().map(({ label, value }) => (
                                <DetailRow key={label} label={label} value={value} />
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                if (selectedType === "user") handleDeleteUser(selectedItem._id);
                                else if (selectedType === "required") handleDeleteRequired(selectedItem._id);
                                else handleDeleteDonation(selectedItem._id);
                                setSelectedItem(null);
                            }}
                            className="w-full mt-6 py-3 bg-red-50 dark:bg-[#351526] text-red-600 dark:text-red-300 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-[#432030] transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Remove Record
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%       { transform: translate(20px, -30px) scale(1.1); }
                    66%       { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob            { animation: blob 7s infinite; }
                .animation-delay-2000    { animation-delay: 2s; }
            `}</style>
        </div>
    );
};

export default Admin;