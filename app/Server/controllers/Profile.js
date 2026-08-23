import DonorBloodDonationexport from "../models/DonorBlooddonation.js";

const Profile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ message: "User not found." });

        const { name, email, bloodGroup, phone, age, role, createdAt, location } = user;

        const donationCount = await DonorBloodDonationexport.countDocuments({
            UserIdinf: user._id,
        });

        return res.json({
            name,
            email,
            bloodGroup,
            phone,
            age,
            role,
            createdAt,
            location,
            donationCount,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error while fetching profile." });
    }
}
export default Profile;
