import express from "express";
import { loginUser } from "../../controllers/userAuth/userAuthController.js";

const router = express.Router();

router.post("/login", loginUser);

export default router;
