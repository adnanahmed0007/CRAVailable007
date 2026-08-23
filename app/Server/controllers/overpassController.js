import axios from "axios";

export const getOverpassData = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Overpass query is required"
            });
        }

        const response = await axios.post(
            "https://overpass-api.de/api/interpreter",
            new URLSearchParams({
                data: query
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        return res.status(200).json({
            success: true,
            data: response.data
        });

    } catch (error) {
        console.error(
            "Overpass API Error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch data from Overpass API"
        });
    }
};