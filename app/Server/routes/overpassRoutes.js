import express from "express";

import {
    getOverpassData,
} from "../controllers/overpassController.js";

const router = express.Router();

router.post(
    "/overpass",
    getOverpassData
);

export default router;