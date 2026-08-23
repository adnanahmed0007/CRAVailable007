import DonorBloodDonationexport from "../models/DonorBlooddonation.js";

const FindAllBlood = async (req, res, next) => {
    try {
        const fetchdata = await DonorBloodDonationexport.find();
        console.log(fetchdata);


        res.status(200).json({ success: true, fectchadat: fetchdata });

    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export default FindAllBlood;