import DonorBloodDonationexport from "../../models/DonorBlooddonation.js";

const DeleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DonorBloodDonationexport.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Donation record not found." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Donation record removed.", deleted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete donation record." });
  }
};

export default DeleteDonation;
