import jwt from "jsonwebtoken";

const Generatetoken = async (user_Id, res) => {
  const token = jwt.sign(
    { user_Id },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 15 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return token;
};

export default Generatetoken;