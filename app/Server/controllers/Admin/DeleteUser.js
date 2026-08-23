import DonorUserexport from "../../models/DonerRegistration.js";
import DonorBloodDonationexport from "../../models/DonorBlooddonation.js";

const DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User id is required." });
    }

    // An admin should not be able to delete their own account through this
    // endpoint, to avoid accidentally locking themselves out.
    if (req.user && req.user._id.toString() === id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own admin account." });
    }

    const deletedUser = await DonorUserexport.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Clean up donation records tied to this user so the admin's
    // "willing donors" list doesn't show orphaned entries.
    await DonorBloodDonationexport.deleteMany({ UserIdinf: id });

    return res.status(200).json({
      success: true,
      message: "User removed successfully.",
      deletedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete user." });
  }
};

export default DeleteUser;
