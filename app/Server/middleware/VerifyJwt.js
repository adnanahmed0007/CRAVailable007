import jwt from "jsonwebtoken";
import DonorUserexport from "../models/DonerRegistration.js";
const verifyJwt = async (req, res, next) => {
    try {
        const mySecretKey = process.env.JWT_SECRET; // ✅ inside


        const token = req.cookies.jwt;



        if (!token) {
            return res.status(401).json({
                message: "No token found. Please login."
            });
        }

        const decoded = jwt.verify(token, mySecretKey);

        const finduser = await DonorUserexport.findById(decoded.user_Id);

        if (!finduser) {
            return res.status(401).json({
                message: "User not found. Please login again."
            });
        }

        req.user = finduser;
        next();

    } catch (error) {
        console.log("JWT Error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
}

export default verifyJwt;
