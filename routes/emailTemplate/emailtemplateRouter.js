import express from "express";
import {
  createEmailTemplate,
  getEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
} from "../../controllers/emailTemplate/emailtemplateController.js";
import {
  authenticateUser,
  authenticateCompanyAndSuperadmin,
} from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/create",
  authenticateUser,
  authenticateCompanyAndSuperadmin,
  createEmailTemplate
);

router.get(
  "/",
  authenticateUser,
  authenticateCompanyAndSuperadmin,
  getEmailTemplate
);

router.put(
  "/update/:templateId",
  authenticateUser,
  authenticateCompanyAndSuperadmin,
  updateEmailTemplate
);

router.delete(
  "/delete/:templateId",
  authenticateUser,
  authenticateCompanyAndSuperadmin,
  deleteEmailTemplate
);

export default router;
