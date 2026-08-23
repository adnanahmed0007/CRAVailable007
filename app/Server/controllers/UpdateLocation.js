import DonorUserexport from "../models/DonerRegistration.js";

const UpdateLocation = async (req, res) => {
  try {
    const user = req.user;
    const { lat, lng, address } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "lat and lng are required." });
    }

    const updated = await DonorUserexport.findByIdAndUpdate(
      user._id,
      { location: { lat, lng, address: address || "" } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Location saved.",
      location: updated.location,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to save location." });
  }
};

export default UpdateLocation;
