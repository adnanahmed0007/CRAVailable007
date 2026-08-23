import DonorUserexport from "../models/DonerRegistration.js"
import express from "express";
import BloodRequiredexport from "../models/BloodRequired.js";
import DonorBloodDonationexport from "../models/DonorBlooddonation.js";
const Findalluser = async (req, res) => {

    try {
        const users = await DonorUserexport.find()
        const bloodrequired = await BloodRequiredexport.find()
        const blooddonation = await DonorBloodDonationexport.find()
        console.log(users);
        console.log(bloodrequired);
        console.log(blooddonation);

        res.status(200).json({ success: true, users: users, bloodrequired: bloodrequired, blooddonation: blooddonation })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export default Findalluser;
