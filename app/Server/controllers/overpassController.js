import axios from "axios";

const GEOAPIFY_URL = "https://api.geoapify.com/v2/places";

export const getOverpassData = async (req, res) => {
    try {
        const {
            latitude,
            longitude,
            radius = 5000,
        } = req.body;

        console.log(
            "========== GEOAPIFY HOSPITAL REQUEST =========="
        );

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log("Radius:", radius);

        // ==========================================
        // VALIDATE LOCATION
        // ==========================================

        const lat = Number(latitude);
        const lon = Number(longitude);
        const searchRadius = Number(radius);

        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lon)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Valid latitude and longitude are required",
            });
        }

        if (
            lat < -90 ||
            lat > 90 ||
            lon < -180 ||
            lon > 180
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid latitude or longitude",
            });
        }

        // ==========================================
        // RADIUS
        // ==========================================

        const finalRadius = Math.min(
            Math.max(
                Number.isFinite(searchRadius)
                    ? searchRadius
                    : 5000,
                100
            ),
            50000
        );

        // ==========================================
        // GEOAPIFY API KEY
        // ==========================================

        const apiKey =
            process.env.GEOAPIFY_API_KEY;

        if (!apiKey) {
            console.error(
                "GEOAPIFY_API_KEY is missing"
            );

            return res.status(500).json({
                success: false,
                message:
                    "Geoapify API key is not configured on the server",
            });
        }

        // ==========================================
        // GEOAPIFY REQUEST
        // ==========================================

        console.log(
            "========== CALLING GEOAPIFY =========="
        );

        const response = await axios.get(
            GEOAPIFY_URL,
            {
                params: {
                    categories:
                        "healthcare.hospital",

                    filter:
                        `circle:${lon},${lat},${finalRadius}`,

                    limit: 20,

                    apiKey: apiKey,
                },

                timeout: 30000,
            }
        );

        console.log(
            "Geoapify Status:",
            response.status
        );

        // ==========================================
        // GET FEATURES
        // ==========================================

        const features =
            response.data?.features || [];

        console.log(
            "Hospitals found:",
            features.length
        );

        // ==========================================
        // CONVERT GEOAPIFY DATA
        // ==========================================

        const hospitals = features
            .map((feature) => {
                const properties =
                    feature.properties || {};

                const coordinates =
                    feature.geometry?.coordinates || [];

                const lng = Number(
                    coordinates[0]
                );

                const lat = Number(
                    coordinates[1]
                );

                if (
                    !Number.isFinite(lat) ||
                    !Number.isFinite(lng)
                ) {
                    return null;
                }

                return {
                    id:
                        properties.place_id ||
                        `${lat}-${lng}`,

                    name:
                        properties.name ||
                        properties.address_line1 ||
                        "Unnamed Hospital",

                    latitude: lat,

                    longitude: lng,

                    address:
                        properties.formatted ||
                        properties.address_line2 ||
                        "Address not available",

                    phone:
                        properties.datasource
                            ?.raw
                            ?.phone ||
                        properties.contact
                            ?.phone ||
                        "",

                    website:
                        properties.website ||
                        "",

                    emergency:
                        properties.datasource
                            ?.raw
                            ?.emergency ===
                        "yes",

                    category:
                        properties.categories ||
                        [],
                };
            })
            .filter(Boolean);

        // ==========================================
        // SUCCESS
        // ==========================================

        console.log(
            "========== GEOAPIFY SUCCESS =========="
        );

        console.log(
            "Returning hospitals:",
            hospitals.length
        );

        return res.status(200).json({
            success: true,

            message:
                "Nearby hospitals fetched successfully",

            hospitals,

            count: hospitals.length,

            // Keep this for compatibility
            // with any old frontend code.
            data: {
                elements: hospitals,
            },
        });

    } catch (error) {
        console.error(
            "========== GEOAPIFY ERROR =========="
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Status:",
            error.response?.status
        );

        console.error(
            "Response:",
            error.response?.data
        );

        return res.status(
            error.response?.status || 500
        ).json({
            success: false,

            message:
                error.response?.data?.message ||
                error.response?.data?.error?.message ||
                "Failed to fetch nearby hospitals",

            error:
                process.env.NODE_ENV ===
                    "development"
                    ? error.message
                    : undefined,
        });
    }
};