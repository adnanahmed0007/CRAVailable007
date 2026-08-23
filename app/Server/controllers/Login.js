import bcrypt from "bcrypt";
import DonorUserexport from "../models/DonerRegistration.js";
import Generatetoken from "../utils/Generatetoken.js";

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const existingUser = await DonorUserexport.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                message: "User not registered",
            });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect password",
            });
        }

        await Generatetoken(existingUser._id, res);

        return res.status(200).json({
            message: "Login successful",
            email: existingUser.email,
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export default Login;