import DonorUserexport from "../../models/DonerRegistration.js";
import bcrypt from "bcrypt";

// Lets an admin create a donor (or admin) account directly from the
// dashboard, without that person needing to sign themselves up.
const AdminAddUser = async (req, res) => {
  try {
    const { name, email, phone, bloodGroup, age, password, role } = req.body;

    if (!name || !email || !phone || !bloodGroup || !age || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await DonorUserexport.findOne({
      $or: [{ email: email.trim().toLowerCase() }, { phone }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "A user with this email or phone already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new DonorUserexport({
      name: name.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      phone,
      bloodGroup: bloodGroup.trim(),
      age,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "donor",
    });

    const saved = await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: {
        _id: saved._id,
        name: saved.name,
        email: saved.email,
        phone: saved.phone,
        bloodGroup: saved.bloodGroup,
        age: saved.age,
        role: saved.role,
        createdAt: saved.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Failed to create user: ${error.message}` });
  }
};

export default AdminAddUser;
