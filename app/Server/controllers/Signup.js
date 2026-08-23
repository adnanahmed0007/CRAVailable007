import DonorUserexport from "../models/DonerRegistration.js";
import bcrypt from "bcrypt";
import Generatetoken from "../utils/Generatetoken.js";

const Signupuser = async (req, res, next) => {
    try {

        const {
            name,
            email,
            phone,
            bloodGroup,
            age,
            password,
            role
        } = req.body;

        // Decide role
        const userRole =
            role === "admin" ? "admin" : "donor";


        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "Name, email, phone and password are required"
            });
        }


        if (userRole === "donor") {

            if (!bloodGroup || !age) {
                return res.status(400).json({
                    message: "Blood group and age are required for donors"
                });
            }

        }



        const findexsistinguser =
            await DonorUserexport.findOne({
                $or: [
                    {
                        email: email.trim().toLowerCase()
                    },
                    {
                        phone: phone
                    }
                ]
            });

        if (findexsistinguser) {

            return res.status(401).json({
                message: "User already registered"
            });

        }




        const hashedpassword =
            await bcrypt.hash(password, 5);



        const newuser = new DonorUserexport({

            name: name.trim().toLowerCase(),

            email: email.trim().toLowerCase(),

            phone: phone,

            bloodGroup:
                userRole === "donor"
                    ? bloodGroup.trim()
                    : undefined,

            age:
                userRole === "donor"
                    ? age
                    : undefined,

            password: hashedpassword,

            // ⭐ THIS WAS MISSING
            role: userRole,
        });



        const saved = await newuser.save();


        await Generatetoken(saved._id, res);



        return res.status(200).json({

            message:
                userRole === "admin"
                    ? "Admin registered successfully"
                    : "User registered successfully",

            email: saved.email,

            role: saved.role,

            newuser: saved,
        });

    } catch (e) {

        console.log(e);

        return res.status(500).json({
            message: `error occurred ${e.message}`
        });

    }
};

export default Signupuser;