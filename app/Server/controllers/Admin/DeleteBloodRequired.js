import BloodRequiredexport from "../../models/BloodRequired.js";

const DeleteBloodRequired = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BloodRequiredexport.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Blood request not found." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Blood request removed.", deleted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete request." });
  }
};

export default DeleteBloodRequired;
