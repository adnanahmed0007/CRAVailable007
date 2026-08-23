import express from "express";
import Donation from "../../controllers/Donation.js";
import Search from "../../controllers/Search.js";
import verifyJwt from "../../middleware/VerifyJwt.js";
import verifyAdmin from "../../middleware/VerifyAdmin.js";
import FindAllBlood from "../../controllers/FIndAllblood.js";
import ViewAllBloodrequired from "../../controllers/ViewAllBloodRequired.js";
import Findalluser from "../../controllers/FindallUser.js";
import MyDonations from "../../controllers/MyDonations.js";
import UpdateLocation from "../../controllers/UpdateLocation.js";

import DeleteUser from "../../controllers/Admin/DeleteUser.js";
import DeleteBloodRequired from "../../controllers/Admin/DeleteBloodRequired.js";
import DeleteDonation from "../../controllers/Admin/DeleteDonation.js";
import AdminAddUser from "../../controllers/Admin/AdminAddUser.js";
import PromoteAdmin from "../../controllers/Admin/PromoteAdmin.js";

const routerDonation = express.Router();

// Existing donor-facing routes
routerDonation.post("/donation/api/register", verifyJwt, Donation);
routerDonation.post("/donation/api/get", verifyJwt, Search);
routerDonation.get("/donation/api/getall", verifyJwt, FindAllBlood);
routerDonation.get("/donation/api/getallbloodrequired", verifyJwt, ViewAllBloodrequired);
routerDonation.get("/donation/api/getallusers", verifyJwt, Findalluser);

// Logged-in user's own donation history + stats (used on Profile page)
routerDonation.get("/donation/api/mydonations", verifyJwt, MyDonations);
routerDonation.post("/donation/api/location", verifyJwt, UpdateLocation);

// Admin-only: manage users, blood requests, and donation records
routerDonation.delete("/donation/api/admin/user/:id", verifyJwt, verifyAdmin, DeleteUser);
routerDonation.post("/donation/api/admin/user", verifyJwt, verifyAdmin, AdminAddUser);
routerDonation.delete("/donation/api/admin/bloodrequired/:id", verifyJwt, verifyAdmin, DeleteBloodRequired);
routerDonation.delete("/donation/api/admin/donation/:id", verifyJwt, verifyAdmin, DeleteDonation);

// One-time bootstrap route to create your first admin (protected by
// ADMIN_SETUP_KEY in .env, not by login) — see Server/README section.
routerDonation.post("/donation/api/admin/promote", PromoteAdmin);

export default routerDonation;
