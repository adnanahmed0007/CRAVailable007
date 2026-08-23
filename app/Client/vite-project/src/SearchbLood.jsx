import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Search,
  Droplet,
  Hospital,
  Phone,
  MessageSquare,
  Heart,
  Clock,
  Users,
  AlertCircle,
  MapPin,
  Calendar,
  CheckCircle,
  User,
} from "lucide-react";

const SearchBlood = () => {
  const [formData, setFormData] = useState({
    bloodGroup: "",
    NearestHospital: "",
    phone: "",
    query: "",
  });

  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState([]);
  const [searchSuccess, setSearchSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setDonors([]);
    setSearchSuccess(false);

    try {
      const payload = {
        bloodGroup: formData.bloodGroup.trim(),
        NearestHospital: formData.NearestHospital.trim().toLowerCase(),
        phone: formData.phone.trim(),
        query: formData.query.trim(),
      };

      const res = await axios.post(
        `http://localhost:9090/auth/dontaion/api/donation/api/get`,
        payload,
        {
          withCredentials: true,
        }
      );

      const fetchedDonors = res.data?.fectchadat || [];

      setDonors(fetchedDonors);
      setSearchSuccess(true);

      setLoading(false);

      toast.success(
        "✅ Your request has been submitted successfully!",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );

      setFormData({
        bloodGroup: "",
        NearestHospital: "",
        phone: "",
        query: "",
      });
    } catch (err) {
      setLoading(false);

      toast.error(
        err.response?.data?.message ||
        "Something went wrong. Please try again.",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";

    return new Date(dateStr).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-[#050d18] dark:via-[#091525] dark:to-[#0b1b30] px-4 py-12 transition-colors duration-300">

      {/* ====================================================== */}
      {/* BACKGROUND DECORATIONS */}
      {/* ====================================================== */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-400 dark:bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />

        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-400 dark:bg-cyan-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000" />

      </div>

      <div className="relative max-w-6xl mx-auto">

        {/* ====================================================== */}
        {/* HERO SECTION */}
        {/* ====================================================== */}

        <div className="text-center mb-12">

          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl shadow-xl mb-4">

            <Search className="w-8 h-8 text-white" />

          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-[#e5f1ff] mb-3">
            Find Blood Donors
          </h1>

          <p className="text-lg text-gray-600 dark:text-[#9bb7d4] max-w-2xl mx-auto">

            Find the right donor at the right time.

            <br />

            <span className="font-semibold text-red-600 dark:text-red-400">
              Every request matters. We're here to help.
            </span>

          </p>

        </div>

        {/* ====================================================== */}
        {/* MAIN GRID */}
        {/* ====================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ================================================== */}
          {/* LEFT COLUMN */}
          {/* ================================================== */}

          <div className="space-y-6">

            {/* ================================================= */}
            {/* HOW IT WORKS */}
            {/* ================================================= */}

            <div className="bg-white/80 dark:bg-[#0d1b2e]/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-[#1e3a5f] transition-all duration-300">

              <h3 className="text-xl font-bold text-gray-900 dark:text-[#e5f1ff] mb-4 flex items-center gap-2">

                <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />

                How It Works

              </h3>

              <div className="space-y-3">

                {[
                  {
                    num: "1",
                    text: "Fill in your requirements",
                  },
                  {
                    num: "2",
                    text: "We search our database",
                  },
                  {
                    num: "3",
                    text: "Get instant matches",
                  },
                  {
                    num: "4",
                    text: "Contact donors directly",
                  },
                ].map((item, idx) => (

                  <div
                    key={idx}
                    className="flex items-start gap-3"
                  >

                    <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-rose-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">

                      {item.num}

                    </div>

                    <span className="text-sm font-medium text-gray-700 dark:text-[#b6cbe0]">
                      {item.text}
                    </span>

                  </div>

                ))}

              </div>

            </div>

            {/* ================================================= */}
            {/* EMERGENCY */}
            {/* ================================================= */}

            <div className="bg-gradient-to-br from-red-600 to-rose-600 dark:from-red-700 dark:to-[#8f1730] rounded-2xl shadow-xl p-6 text-white">

              <div className="flex items-center gap-2 mb-3">

                <AlertCircle className="w-6 h-6" />

                <h3 className="text-xl font-bold">
                  Emergency?
                </h3>

              </div>

              <p className="text-sm text-red-100 mb-4">
                For urgent requirements, call our 24/7 helpline
              </p>

              <div className="bg-white/20 dark:bg-black/20 rounded-xl p-3 text-center">

                <div className="text-2xl font-black">
                  1-800-DONATE
                </div>

                <div className="text-xs text-red-100">
                  Available 24/7
                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* ACTIVE DONORS */}
            {/* ================================================= */}

            <div className="bg-white/80 dark:bg-[#0d1b2e]/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-[#1e3a5f] transition-all duration-300">

              <div className="text-center">

                <Users className="w-10 h-10 text-red-600 dark:text-red-400 mx-auto mb-2" />

                <div className="text-4xl font-black text-red-600 dark:text-red-400 mb-1">
                  8,500+
                </div>

                <div className="text-sm text-gray-600 dark:text-[#9bb7d4] font-medium">
                  Active Donors Ready
                </div>

              </div>

            </div>

          </div>

          {/* ================================================== */}
          {/* RIGHT COLUMN - SEARCH FORM */}
          {/* ================================================== */}

          <div className="lg:col-span-2">

            <div className="bg-white/80 dark:bg-[#0d1b2e]/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-200 dark:border-[#1e3a5f] transition-all duration-300">

              {/* FORM HEADER */}

              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-[#254463]">

                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center">

                  <Search className="w-6 h-6 text-white" />

                </div>

                <div>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e5f1ff]">
                    Search for Blood
                  </h2>

                  <p className="text-sm text-gray-600 dark:text-[#9bb7d4]">
                    Fill in your requirements to find donors
                  </p>

                </div>

              </div>

              {/* ================================================= */}
              {/* FORM */}
              {/* ================================================= */}

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* ================================================= */}
                {/* BLOOD GROUP */}
                {/* ================================================= */}

                <div className="space-y-2">

                  <label
                    htmlFor="bloodGroup"
                    className="block text-sm font-semibold text-gray-700 dark:text-[#c4d8ed]"
                  >
                    Required Blood Group{" "}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <Droplet className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6f94b8]" />

                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] border border-gray-300 dark:border-[#29496b] rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      required
                    >

                      <option value="">
                        Select Blood Group
                      </option>

                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>

                    </select>

                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">

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
                {/* HOSPITAL */}
                {/* ================================================= */}

                <div className="space-y-2">

                  <label
                    htmlFor="NearestHospital"
                    className="block text-sm font-semibold text-gray-700 dark:text-[#c4d8ed]"
                  >
                    Hospital / Blood Center{" "}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <Hospital className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6f94b8]" />

                    <input
                      type="text"
                      id="NearestHospital"
                      name="NearestHospital"
                      placeholder="Enter hospital or blood center name"
                      value={formData.NearestHospital}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] border border-gray-300 dark:border-[#29496b] rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
                    Your Contact Number{" "}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6f94b8]" />

                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] border border-gray-300 dark:border-[#29496b] rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                    />

                  </div>

                </div>

                {/* ================================================= */}
                {/* QUERY */}
                {/* ================================================= */}

                <div className="space-y-2">

                  <label
                    htmlFor="query"
                    className="block text-sm font-semibold text-gray-700 dark:text-[#c4d8ed]"
                  >
                    Additional Details{" "}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400 dark:text-[#6f94b8]" />

                    <textarea
                      id="query"
                      name="query"
                      placeholder="Describe your requirement, urgency level, patient condition, or any other relevant details..."
                      value={formData.query}
                      onChange={handleChange}
                      rows="4"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#101f34] text-gray-900 dark:text-[#e5f1ff] placeholder-gray-400 dark:placeholder-[#6683a3] border border-gray-300 dark:border-[#29496b] rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                      required
                    />

                  </div>

                </div>

                {/* ================================================= */}
                {/* PRIVACY */}
                {/* ================================================= */}

                <div className="bg-blue-50 dark:bg-[#0b2945] border border-blue-200 dark:border-[#1d5a88] rounded-xl p-4 transition-colors duration-300">

                  <p className="text-sm text-blue-800 dark:text-[#a9d8ff]">

                    <strong>Privacy:</strong>{" "}
                    Your contact information will only be
                    shared with matched donors. We respect
                    your privacy.

                  </p>

                </div>

                {/* ================================================= */}
                {/* SUBMIT */}
                {/* ================================================= */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-600 dark:to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        />

                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />

                      </svg>

                      <span>
                        Searching...
                      </span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />

                      <span>
                        Search for Donors
                      </span>
                    </>
                  )}

                </button>

              </form>

              {/* ================================================= */}
              {/* ADDITIONAL HELP */}
              {/* ================================================= */}

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#254463] text-center">

                <p className="text-sm text-gray-600 dark:text-[#9bb7d4]">

                  Need immediate assistance?{" "}

                  <a
                    href="tel:1-800-DONATE"
                    className="font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    Call 1-800-DONATE
                  </a>

                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================== */}
        {/* DONOR RESULTS */}
        {/* ====================================================== */}

        {searchSuccess && (

          <div className="mt-12 animate-fadeInUp">

            {/* RESULTS HEADER */}

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">

                <CheckCircle className="w-6 h-6 text-white" />

              </div>

              <div>

                <h2 className="text-2xl font-black text-gray-900 dark:text-[#e5f1ff]">

                  🎉 We Found {donors.length} Donor
                  {donors.length !== 1 ? "s" : ""}!

                </h2>

                <p className="text-sm text-gray-500 dark:text-[#8da9c3]">
                  Contact them directly to arrange donation
                </p>

              </div>

            </div>

            {/* ================================================= */}
            {/* NO DONORS */}
            {/* ================================================= */}

            {donors.length === 0 ? (

              <div className="bg-white/80 dark:bg-[#0d1b2e]/90 backdrop-blur-lg rounded-2xl shadow-xl p-10 border border-gray-200 dark:border-[#1e3a5f] text-center">

                <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-3" />

                <p className="text-lg font-semibold text-gray-700 dark:text-[#c4d8ed]">
                  No donors found nearby
                </p>

                <p className="text-sm text-gray-500 dark:text-[#829fb9] mt-1">
                  Try a different hospital or blood group
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {donors.map((donor, idx) => (

                  <div
                    key={donor._id || idx}
                    className="bg-white/90 dark:bg-[#0d1b2e]/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 dark:border-[#1e3a5f] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    style={{
                      animationDelay: `${idx * 100}ms`,
                    }}
                  >

                    {/* ================================================= */}
                    {/* CARD TOP */}
                    {/* ================================================= */}

                    <div className="bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-700 dark:to-[#8f1730] px-6 py-4 flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">

                          <User className="w-5 h-5 text-white" />

                        </div>

                        <div>

                          <p className="text-white/80 text-xs font-medium">
                            Blood Donor
                          </p>

                          <p className="text-white font-bold text-sm">
                            Available
                          </p>

                        </div>

                      </div>

                      <div className="bg-white dark:bg-[#f8fbff] rounded-xl px-4 py-2 text-center">

                        <span className="text-red-600 font-black text-xl">
                          {donor.bloodGroup}
                        </span>

                      </div>

                    </div>

                    {/* ================================================= */}
                    {/* CARD BODY */}
                    {/* ================================================= */}

                    <div className="p-5 space-y-3">

                      {/* HOSPITAL */}

                      <div className="flex items-start gap-3">

                        <div className="w-8 h-8 bg-red-50 dark:bg-[#351526] rounded-lg flex items-center justify-center flex-shrink-0">

                          <Hospital className="w-4 h-4 text-red-600 dark:text-red-400" />

                        </div>

                        <div>

                          <p className="text-xs text-gray-400 dark:text-[#6685a3] font-medium uppercase tracking-wide">
                            Hospital
                          </p>

                          <p className="text-sm font-semibold text-gray-800 dark:text-[#d6e7f7] capitalize">
                            {donor.NearestHospital || "N/A"}
                          </p>

                        </div>

                      </div>

                      {/* ADDRESS */}

                      <div className="flex items-start gap-3">

                        <div className="w-8 h-8 bg-red-50 dark:bg-[#351526] rounded-lg flex items-center justify-center flex-shrink-0">

                          <MapPin className="w-4 h-4 text-red-600 dark:text-red-400" />

                        </div>

                        <div>

                          <p className="text-xs text-gray-400 dark:text-[#6685a3] font-medium uppercase tracking-wide">
                            Address
                          </p>

                          <p className="text-sm font-semibold text-gray-800 dark:text-[#d6e7f7]">
                            {donor.Address || "N/A"}
                          </p>

                        </div>

                      </div>

                      {/* PHONE */}

                      <div className="flex items-start gap-3">

                        <div className="w-8 h-8 bg-red-50 dark:bg-[#351526] rounded-lg flex items-center justify-center flex-shrink-0">

                          <Phone className="w-4 h-4 text-red-600 dark:text-red-400" />

                        </div>

                        <div>

                          <p className="text-xs text-gray-400 dark:text-[#6685a3] font-medium uppercase tracking-wide">
                            Contact
                          </p>

                          <p className="text-sm font-semibold text-gray-800 dark:text-[#d6e7f7]">
                            {donor.phoneNumber || "N/A"}
                          </p>

                        </div>

                      </div>

                      {/* REGISTER DATE */}

                      <div className="flex items-start gap-3">

                        <div className="w-8 h-8 bg-red-50 dark:bg-[#351526] rounded-lg flex items-center justify-center flex-shrink-0">

                          <Calendar className="w-4 h-4 text-red-600 dark:text-red-400" />

                        </div>

                        <div>

                          <p className="text-xs text-gray-400 dark:text-[#6685a3] font-medium uppercase tracking-wide">
                            Registered On
                          </p>

                          <p className="text-sm font-semibold text-gray-800 dark:text-[#d6e7f7]">
                            {formatDate(
                              donor.Registerday ||
                              donor.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* ================================================= */}
                    {/* CALL BUTTON */}
                    {/* ================================================= */}

                    <div className="px-5 pb-5">

                      <a
                        href={`tel:${donor.phoneNumber}`}
                        className="w-full bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-600 dark:to-red-700 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                      >

                        <Phone className="w-4 h-4" />

                        Call Donor

                      </a>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        )}

        {/* ====================================================== */}
        {/* BOTTOM INFO BANNER */}
        {/* ====================================================== */}

        <div className="mt-12 bg-white/80 dark:bg-[#0d1b2e]/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-[#1e3a5f] transition-all duration-300">

          <div className="flex items-center justify-center gap-8 flex-wrap">

            {[
              {
                icon: Heart,
                text: "24/7 Support",
              },
              {
                icon: Users,
                text: "8,500+ Donors",
              },
              {
                icon: Clock,
                text: "Instant Matching",
              },
            ].map((item, idx) => {

              const Icon = item.icon;

              return (

                <div
                  key={idx}
                  className="flex items-center gap-3"
                >

                  <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />

                  <span className="font-semibold text-gray-700 dark:text-[#b6cbe0]">
                    {item.text}
                  </span>

                </div>

              );

            })}

          </div>

        </div>

      </div>

      {/* ====================================================== */}
      {/* TOAST */}
      {/* ====================================================== */}

      <ToastContainer />

      {/* ====================================================== */}
      {/* ANIMATIONS */}
      {/* ====================================================== */}

      <style jsx>{`

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

        @keyframes fadeInUp {

          from {
            opacity: 0;
            transform: translateY(30px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
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

export default SearchBlood;