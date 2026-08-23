

import DonorBloodDonationexport from "../models/DonorBlooddonation.js";
const Donation = async (req, res, next) => {
    try {
        const user = req.user;


        if (!user) {
            return res.status(404).json({ message: "Please verify your account before donating" });
        }

        const { bloodGroup, Registerday, Address, NearestHospital } = req.body;

        if (bloodGroup && Registerday && Address && NearestHospital) {
            const userIdInfo = user._id;



            const newdatasaved = new DonorBloodDonationexport({
                bloodGroup: bloodGroup.trim(),
                Registerday: Registerday,
                Address: Address.trim().toLowerCase(),
                NearestHospital: NearestHospital.trim().toLowerCase(),
                UserIdinf: userIdInfo,
                phoneNumber: user.phone,
            })

            const chcek = await newdatasaved.save();

            if (!chcek) {
                return res
                    .status(404)
                    .json({
                        message: "we cant saved the data",
                    })
            }
            return res
                .status(201)
                .json({
                    message: "Donorregsiter suddcefully",
                    newdatasaved

                })
        }
        else {
            return res
                .status(400)
                .json({
                    message: "all the credetials are qeured"
                })
        }


    }
    catch (E) {
        console.log(E);
        return res
            .status(402)
            .json({
                message: `error occured ${E}`
            })
    }
}
export default Donation;