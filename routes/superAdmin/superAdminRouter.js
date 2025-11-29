import express from "express";
import { createSuperAdmin } from "../../controllers/superAdmin/superAdminController.js";

const router = express.Router();

router.post("/create", createSuperAdmin);

export default router;
