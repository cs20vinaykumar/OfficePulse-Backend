import express from "express";
import {
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
} from "../../controllers/userAuth/forgotPasswordController.js";

const router = express.Router();

router.post("/send-reset-otp", sendResetOTP);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

export default router;
