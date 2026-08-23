import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

import {
  MapPin,
  LocateFixed,
  Hospital,
  Navigation,
  Loader2,
  AlertCircle,
  RefreshCw,
  Heart,
  ChevronRight,
  Radius,
} from "lucide-react";

import { useTheme } from "./ThemeContext";

// ============================================================
// LEAFLET DEFAULT MARKER
// ============================================================

const defaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// ============================================================
// USER LOCATION ICON
// ============================================================

const userIcon = L.divIcon({
  className: "",
  html: `
    <div
      style="
        width:20px;
        height:20px;
        border-radius:9999px;
        background:#dc2626;
        border:3px solid white;
        box-shadow:0 0 0 3px rgba(220,38,38,0.35);
      "
    ></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// ============================================================
// HOSPITAL ICON
// ============================================================

const hospitalIcon = L.divIcon({
  className: "",
  html: `
    <div
      style="
        width:30px;
        height:30px;
        border-radius:50%;
        background:#ffffff;
        border:2px solid #dc2626;
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 2px 6px rgba(0,0,0,0.3);
        font-size:15px;
      "
    >
      🏥
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

// ============================================================
// HAVERSINE DISTANCE
// ============================================================

const distanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// ============================================================
// RADIUS OPTIONS
// ============================================================

const RADIUS_OPTIONS = [
  {
    label: "5 km",
    value: 5000,
  },
  {
    label: "10 km",
    value: 10000,
  },
  {
    label: "20 km",
    value: 20000,
  },
];

// ============================================================
// COMPONENT
// ============================================================

const NearbyHospitals = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const hospitalMarkersRef = useRef([]);

  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [locating, setLocating] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [radius, setRadius] = useState(10000);
  const [selectedId, setSelectedId] = useState(null);

  // ============================================================
  // INITIALIZE MAP
  // ============================================================

  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;

    const map = L.map(mapDivRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ============================================================
  // CHANGE MAP THEME
  // ============================================================

  useEffect(() => {
    if (!mapRef.current) return;

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    const url =
      theme === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    tileLayerRef.current = L.tileLayer(url, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(mapRef.current);
  }, [theme]);

  // ============================================================
  // LOCATE USER
  // ============================================================

  const locateMe = () => {
    setError("");

    if (!navigator.geolocation) {
      setError(
        "Your browser doesn't support location access. Try entering a location manually below."
      );
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setUserLocation(loc);
        setLocating(false);

        if (mapRef.current) {
          mapRef.current.setView([loc.lat, loc.lng], 13);

          if (userMarkerRef.current) {
            mapRef.current.removeLayer(userMarkerRef.current);
          }

          userMarkerRef.current = L.marker(
            [loc.lat, loc.lng],
            {
              icon: userIcon,
            }
          )
            .addTo(mapRef.current)
            .bindPopup("You are here");
        }
      },

      (err) => {
        setLocating(false);

        setError(
          err.code === 1
            ? "Location permission denied. Please allow location access and try again."
            : "Couldn't get your location. Please try again."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  // ============================================================
  // SEARCH HOSPITALS
  // ============================================================

  const searchHospitals = async () => {
    if (!userLocation) return;

    setSearching(true);
    setError("");
    setHospitals([]);

    hospitalMarkersRef.current.forEach((m) =>
      mapRef.current?.removeLayer(m)
    );

    hospitalMarkersRef.current = [];

    try {
      const query = `[out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radius},${userLocation.lat},${userLocation.lng});
          way["amenity"="hospital"](around:${radius},${userLocation.lat},${userLocation.lng});
          relation["amenity"="hospital"](around:${radius},${userLocation.lat},${userLocation.lng});
        );
        out center tags;`;

      const res = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          body: query,
        }
      );

      if (!res.ok) {
        throw new Error("Search failed");
      }

      const data = await res.json();

      const results = (data.elements || [])
        .map((el) => {
          const lat = el.lat ?? el.center?.lat;
          const lng = el.lon ?? el.center?.lon;

          if (!lat || !lng) return null;

          const tags = el.tags || {};

          const addressParts = [
            tags["addr:housenumber"],
            tags["addr:street"],
            tags["addr:suburb"] ||
            tags["addr:neighbourhood"],
            tags["addr:city"],
          ].filter(Boolean);

          return {
            id: `${el.type}-${el.id}`,

            name:
              tags.name ||
              tags["name:en"] ||
              "Unnamed Hospital",

            lat,
            lng,

            address: addressParts.join(", "),

            phone:
              tags.phone ||
              tags["contact:phone"] ||
              "",

            emergency: tags.emergency === "yes",

            distance: distanceKm(
              userLocation.lat,
              userLocation.lng,
              lat,
              lng
            ),
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance);

      setHospitals(results);

      // ========================================================
      // ADD HOSPITAL MARKERS
      // ========================================================

      results.forEach((h) => {
        const marker = L.marker(
          [h.lat, h.lng],
          {
            icon: hospitalIcon,
          }
        )
          .addTo(mapRef.current)
          .bindPopup(
            `<b>${h.name}</b><br/>${h.distance.toFixed(
              2
            )} km away`
          );

        marker.on("click", () => {
          setSelectedId(h.id);
        });

        hospitalMarkersRef.current.push(marker);
      });

      if (results.length === 0) {
        setError(
          "No hospitals found within this radius via OpenStreetMap data. Try a larger radius."
        );
      }
    } catch (e) {
      console.log(e);

      setError(
        "Couldn't reach the hospital search service. Please check your connection and try again."
      );
    } finally {
      setSearching(false);
    }
  };

  // ============================================================
  // SEARCH WHEN LOCATION/RADIUS CHANGES
  // ============================================================

  useEffect(() => {
    if (userLocation) {
      searchHospitals();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, radius]);

  // ============================================================
  // SELECT HOSPITAL
  // ============================================================

  const selectHospital = (h) => {
    navigate("/donate", {
      state: {
        NearestHospital: h.name,

        Address:
          h.address ||
          `${h.lat.toFixed(5)}, ${h.lng.toFixed(5)}`,
      },
    });
  };

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-[#050d18] dark:via-[#091525] dark:to-[#0b1b30] px-4 py-10 transition-colors duration-300">

      <div className="max-w-6xl mx-auto">

        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl shadow-xl mb-4">
            <MapPin className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-[#e5f1ff] mb-2 transition-colors">
            Find Hospitals Near You
          </h1>

          <p className="text-gray-600 dark:text-[#9bb7d4] max-w-2xl mx-auto transition-colors">
            Share your location and we'll show nearby hospitals
            and blood centers, sorted by distance — powered by
            OpenStreetMap.
          </p>
        </div>

        {/* ====================================================== */}
        {/* CONTROL CARD */}
        {/* ====================================================== */}

        <div className="bg-white/80 dark:bg-[#0d1b2e]/90 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-[#1e3a5f] p-4 md:p-6 mb-6 transition-all duration-300">

          <div className="flex flex-wrap items-center gap-3 justify-between">

            {/* LOCATE BUTTON */}

            <button
              onClick={locateMe}
              disabled={locating}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
            >
              {locating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LocateFixed className="w-5 h-5" />
              )}

              {locating
                ? "Locating..."
                : userLocation
                  ? "Update My Location"
                  : "Use My Location"}
            </button>

            {/* RADIUS */}

            <div className="flex items-center gap-2">

              <Radius className="w-4 h-4 text-gray-400 dark:text-[#79a6cf]" />

              <div className="flex gap-1 bg-gray-100 dark:bg-[#10243d] border border-transparent dark:border-[#29496b] rounded-xl p-1">

                {RADIUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setRadius(opt.value)
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${radius === opt.value
                      ? "bg-white dark:bg-[#1b3b5c] text-red-600 dark:text-red-400 shadow"
                      : "text-gray-500 dark:text-[#8faeca] hover:text-blue-600 dark:hover:text-blue-300"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}

              </div>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-[#321524] border border-red-200 dark:border-[#713047] rounded-xl px-4 py-3">

              <AlertCircle className="w-4 h-4 flex-shrink-0" />

              <span>{error}</span>

            </div>
          )}
        </div>

        {/* ====================================================== */}
        {/* MAP + HOSPITAL LIST */}
        {/* ====================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ==================================================== */}
          {/* MAP */}
          {/* ==================================================== */}

          <div className="lg:col-span-3 bg-white dark:bg-[#0d1b2e] rounded-3xl shadow-xl border border-gray-200 dark:border-[#1e3a5f] overflow-hidden transition-all duration-300">

            <div
              ref={mapDivRef}
              className={`w-full h-[420px] lg:h-[560px] ${theme === "dark"
                ? "dark-blue-map"
                : ""
                }`}
            />

          </div>

          {/* ==================================================== */}
          {/* HOSPITAL LIST */}
          {/* ==================================================== */}

          <div className="lg:col-span-2 bg-white/80 dark:bg-[#0d1b2e]/90 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-[#1e3a5f] p-5 max-h-[560px] overflow-y-auto transition-all duration-300">

            {/* LIST HEADER */}

            <h2 className="font-black text-gray-900 dark:text-[#e5f1ff] mb-4 flex items-center gap-2">

              <Hospital className="w-5 h-5 text-red-600 dark:text-red-400" />

              Nearby Hospitals

              {hospitals.length > 0 && (
                <span className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs font-bold px-2 py-0.5 rounded-full">
                  {hospitals.length}
                </span>
              )}

            </h2>

            {/* ================================================== */}
            {/* SEARCHING */}
            {/* ================================================== */}

            {searching && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400 dark:text-[#7695b2]">

                <Loader2 className="w-8 h-8 animate-spin text-red-500" />

                <p className="text-sm font-medium">
                  Searching nearby hospitals...
                </p>

              </div>
            )}

            {/* ================================================== */}
            {/* NO LOCATION */}
            {/* ================================================== */}

            {!searching &&
              !userLocation && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">

                  <Navigation className="w-10 h-10 text-gray-300 dark:text-[#456986]" />

                  <p className="text-sm text-gray-400 dark:text-[#7695b2] max-w-xs">
                    Tap "Use My Location" above to
                    see hospitals near you on the map.
                  </p>

                </div>
              )}

            {/* ================================================== */}
            {/* NO HOSPITALS */}
            {/* ================================================== */}

            {!searching &&
              userLocation &&
              hospitals.length === 0 &&
              !error && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">

                  <Hospital className="w-10 h-10 text-gray-300 dark:text-[#456986]" />

                  <p className="text-sm text-gray-400 dark:text-[#7695b2]">
                    No hospitals found nearby yet.
                  </p>

                </div>
              )}

            {/* ================================================== */}
            {/* HOSPITALS */}
            {/* ================================================== */}

            <div className="space-y-3">

              {hospitals.map((h) => (
                <div
                  key={h.id}
                  onClick={() => {
                    setSelectedId(h.id);

                    mapRef.current?.setView(
                      [h.lat, h.lng],
                      15
                    );
                  }}
                  className={`group cursor-pointer rounded-2xl border p-4 transition-all ${selectedId === h.id
                    ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-[#351526]"
                    : "border-gray-100 dark:border-[#1d3650] hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50/40 dark:hover:bg-[#241522]"
                    }`}
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      {/* HOSPITAL NAME */}

                      <p className="font-bold text-gray-900 dark:text-[#e5f1ff] text-sm truncate">
                        {h.name}
                      </p>

                      {/* ADDRESS */}

                      {h.address && (
                        <p className="text-xs text-gray-500 dark:text-[#8ba7c2] mt-0.5 truncate">
                          {h.address}
                        </p>
                      )}

                      {/* DISTANCE / EMERGENCY */}

                      <div className="flex items-center gap-2 mt-2">

                        <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">
                          {h.distance.toFixed(1)} km
                        </span>

                        {h.emergency && (
                          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-full">
                            24/7 Emergency
                          </span>
                        )}

                      </div>
                    </div>

                    {/* USE BUTTON */}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectHospital(h);
                      }}
                      className="flex-shrink-0 flex items-center gap-1 bg-gray-900 dark:bg-[#173451] text-white dark:text-[#d9ecff] text-xs font-bold px-3 py-2 rounded-xl hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white transition-colors"
                    >

                      <Heart className="w-3.5 h-3.5" />

                      Use

                    </button>

                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* FOOTER */}
        {/* ====================================================== */}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-[#6485a3]">

          <ChevronRight className="w-3 h-3" />

          Hospital data via OpenStreetMap / Overpass API.
          Always call ahead to confirm blood donation availability.

        </div>

      </div>

      {/* ======================================================== */}
      {/* DARK BLUE MAP CSS */}
      {/* ======================================================== */}

      <style>{`

        /* =========================================
           DARK BLUE MAP
           ========================================= */

        .dark-blue-map .leaflet-tile-pane {
          filter:
            hue-rotate(165deg)
            saturate(1.35)
            brightness(0.9)
            contrast(1.05);
        }

        /* =========================================
           MAP ZOOM BUTTONS
           ========================================= */

        .dark-blue-map .leaflet-control-zoom a {
          background: #10243d;
          color: #c9e4ff;
          border-color: #29496b;
        }

        .dark-blue-map .leaflet-control-zoom a:hover {
          background: #173858;
          color: white;
        }

        /* =========================================
           MAP ATTRIBUTION
           ========================================= */

        .dark-blue-map .leaflet-control-attribution {
          background: rgba(5, 13, 24, 0.88);
          color: #8eabc7;
        }

        .dark-blue-map .leaflet-control-attribution a {
          color: #76b8ed;
        }

        /* =========================================
           POPUP
           ========================================= */

        .dark-blue-map .leaflet-popup-content-wrapper {
          background: #0d1b2e;
          color: #e5f1ff;
          border: 1px solid #29496b;
        }

        .dark-blue-map .leaflet-popup-tip {
          background: #0d1b2e;
        }

        .dark-blue-map .leaflet-popup-content b {
          color: #e5f1ff;
        }

        /* =========================================
           MAP CONTROLS SHADOW
           ========================================= */

        .dark-blue-map .leaflet-control-zoom {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
        }

        /* =========================================
           SCROLLBAR FOR HOSPITAL LIST
           ========================================= */

        .dark-blue-map::-webkit-scrollbar {
          width: 8px;
        }

      `}</style>
    </div>
  );
};

export default NearbyHospitals;