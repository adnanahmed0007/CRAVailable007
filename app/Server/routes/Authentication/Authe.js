import express from "express";
import Signupuser from "../../controllers/Signup.js";
import Login from "../../controllers/Login.js";
import Logout from "../../controllers/Logout.js";
import verifyJwt from "../../middleware/VerifyJwt.js";
import Profile from "../../controllers/Profile.js";
 import check from "../../controllers/Check.js";
const router = express.Router();
router.post("/signup", Signupuser);
router.get("/me", verifyJwt, check)

router.post("/login", Login)
router.get("/logout", verifyJwt, Logout)
router.get("/profile", verifyJwt, Profile)


export default router;
