import DonorUserexport from "../../models/DonerRegistration.js";

// One-time bootstrap route: since a brand-new database has no admin yet,
// this lets you promote an existing signed-up user to "admin" by email,
// as long as you supply the ADMIN_SETUP_KEY secret from your .env file.
// Call this once (e.g. with curl or Postman), then remove/rotate the key.
const PromoteAdmin = async (req, res) => {
  try {
    const { email, setupKey } = req.body;

    if (!email || !setupKey) {
      return res.status(400).json({ message: "email and setupKey are required." });
    }

    if (!process.env.ADMIN_SETUP_KEY || setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ message: "Invalid setup key." });
    }

    const user = await DonorUserexport.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user found with that email." });
    }

    return res.status(200).json({
      success: true,
      message: `${user.email} is now an admin.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to promote user." });
  }
};

export default PromoteAdmin;
