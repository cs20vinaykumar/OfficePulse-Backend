import express from "express";
import {
  loginUser,
  verifyLoginOTP,
  toggleSecurityCode,
} from "../../controllers/userAuth/userAuthController.js";

import {
  authenticateUser,
  authenticateCompanyAndSuperadmin,
} from "../../middleware/auth.js";
const router = express.Router();

router.post("/login", loginUser);

router.post("/verify-login-otp", verifyLoginOTP);

router.patch(
  "/toggle-security-code/:targetId",
  authenticateUser,
  authenticateCompanyAndSuperadmin,
  toggleSecurityCode
);

export default router;
