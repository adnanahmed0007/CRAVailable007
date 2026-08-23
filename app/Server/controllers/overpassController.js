import axios from "axios";

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

        const response = await axios.post(
            "https://overpass-api.de/api/interpreter",
            params.toString(),
            {
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                },
                timeout: 30000,
            }
        );

        console.log("Overpass response received");

        return res.status(200).json({
            success: true,
            data: response.data,
        });

    } catch (error) {

        console.error("========== OVERPASS ERROR ==========");

        console.error("Message:", error.message);

        console.error(
            "Status:",
            error.response?.status
        );

        console.error(
            "Response:",
            error.response?.data
        );

        return res.status(500).json({
            success: false,
            message: "Overpass API request failed",
            error:
                error.response?.data ||
                error.message,
        });
    }
};