import axios from "axios";

const OVERPASS_SERVERS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.nchc.org.tw/api/interpreter",
];
export const getOverpassData = async (req, res) => {
    const { query } = req.body;

    console.log("========== OVERPASS REQUEST ==========");
    console.log("Query received:");
    console.log(query);

    if (!query) {
        return res.status(400).json({
            success: false,
            message: "Overpass query is required",
        });
    }

    const errors = [];

    for (const server of OVERPASS_SERVERS) {
        try {
            console.log("\n=================================");
            console.log("Trying:", server);
            console.log("=================================");

            const response = await axios.post(
                server,
                new URLSearchParams({
                    data: query,
                }).toString(),
                {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                        Accept: "application/json",
                        "User-Agent":
                            "CRAvailable/1.0 (hospital finder)",
                    },
                    timeout: 120000,
                    validateStatus: () => true,
                }
            );

            console.log("STATUS:", response.status);

            console.log(
                "CONTENT TYPE:",
                response.headers["content-type"]
            );

            if (response.status >= 200 && response.status < 300) {
                console.log(
                    "========== OVERPASS SUCCESS =========="
                );

                console.log(
                    "Elements:",
                    response.data?.elements?.length || 0
                );

                return res.status(200).json({
                    success: true,
                    data: response.data,
                });
            }

            console.error(
                "========== OVERPASS SERVER ERROR =========="
            );

            console.error("Server:", server);
            console.error("Status:", response.status);
            console.error("Response:", response.data);

            errors.push({
                server,
                status: response.status,
                response:
                    typeof response.data === "string"
                        ? response.data.substring(0, 1000)
                        : response.data,
            });

        } catch (error) {
            console.error(
                "========== OVERPASS REQUEST ERROR =========="
            );

            console.error("Server:", server);
            console.error("Message:", error.message);
            console.error("Code:", error.code);
            console.error(
                "Status:",
                error.response?.status
            );
            console.error(
                "Response:",
                error.response?.data
            );

            errors.push({
                server,
                status: error.response?.status || null,
                message: error.message,
                code: error.code || null,
            });
        }
    }

    console.error(
        "========== ALL OVERPASS SERVERS FAILED =========="
    );

    return res.status(502).json({
        success: false,
        message: "All Overpass API servers failed",
        errors,
    });
};