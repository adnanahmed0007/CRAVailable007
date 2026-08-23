import axios from "axios";

const OVERPASS_SERVERS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
];

export const getOverpassData = async (req, res) => {
    try {
        const { query } = req.body;

        console.log("========== OVERPASS REQUEST ==========");
        console.log("Query received:", query);

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Overpass query is required",
            });
        }

        const params = new URLSearchParams();
        params.append("data", query);

        let lastError = null;

        for (const server of OVERPASS_SERVERS) {
            try {
                console.log("========================================");
                console.log("Trying Overpass server:");
                console.log(server);

                const response = await axios.post(
                    server,
                    params.toString(),
                    {
                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded",
                            Accept: "application/json",
                            "User-Agent":
                                "CRAvailable/1.0",
                        },

                        timeout: 90000,
                    }
                );

                console.log(
                    "========== OVERPASS SUCCESS =========="
                );

                console.log(
                    "Server:",
                    server
                );

                console.log(
                    "Elements received:",
                    response.data?.elements?.length || 0
                );

                return res.status(200).json({
                    success: true,
                    data: response.data,
                });

            } catch (error) {
                lastError = error;

                console.error(
                    "========== OVERPASS SERVER FAILED =========="
                );

                console.error(
                    "Server:",
                    server
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

                console.log(
                    "Trying next Overpass server..."
                );
            }
        }

        console.error(
            "========== ALL OVERPASS SERVERS FAILED =========="
        );

        return res.status(502).json({
            success: false,
            message:
                "All Overpass API servers are currently unavailable.",
            error:
                lastError?.response?.data ||
                lastError?.message ||
                "Unknown Overpass error",
        });

    } catch (error) {
        console.error(
            "========== BACKEND ERROR =========="
        );

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};