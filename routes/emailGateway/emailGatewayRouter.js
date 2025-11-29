import express from "express";

import {
  createEmailGateway,
  getEmailGatewayBYId,
  testEmailGateway,
  updateEmailGateway,
  verifyEmailGateway,
} from "../../controllers/emailgateway/emailGatewayController.js";

import {
  authenticateUser,
  authenticateCompanyAndSuperadmin,
} from "../../middleware/auth.js";
const router = express.Router();

router.post(
  "/create",
  authenticateUser,
  authenticateCompanyAndSuperadmin,
  createEmailGateway
);

router.post(
  "/verify",
  authenticateUser,
  authenticateCompanyAndSuperadmin,
  verifyEmailGateway
);

router.put(
  "/update/:emailGatewayId",
  authenticateUser,
  authenticateCompanyAndSuperadmin,
  updateEmailGateway
);

router.get(
  "/",
  authenticateUser,
  authenticateCompanyAndSuperadmin,
  getEmailGatewayBYId
);

router.post(
  "/test",
  authenticateUser,
  authenticateCompanyAndSuperadmin,
  testEmailGateway
);

export default router;
