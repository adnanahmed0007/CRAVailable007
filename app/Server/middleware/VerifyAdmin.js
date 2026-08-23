// Must run AFTER verifyJwt, which attaches req.user
const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login first." });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error while verifying admin access." });
  }
};

export default verifyAdmin;
