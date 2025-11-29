import express from "express";
import {
  createCompany,
  createSuperAdmin,
  deleteCompany,
  getAllCompany,
  getCompanyById,
  updateCompany,
} from "../../controllers/superAdmin/superAdminController.js";
import {
  authenticateUser,
  isSuperAdminAuthorized,
} from "../../middleware/auth.js";

import upload from "../../utils/multerManagement/assetsStorage.js";

const router = express.Router();

router.post("/create", createSuperAdmin);

router.post(
  "/create-company",
  authenticateUser,
  isSuperAdminAuthorized,
  upload,
  createCompany
);
router.get("/", authenticateUser, isSuperAdminAuthorized, getAllCompany);

router.get("/:companyId", authenticateUser, getCompanyById);

router.put(
  "/:companyId",
  authenticateUser,
  isSuperAdminAuthorized,
  upload,
  updateCompany
);

router.delete(
  "/:companyId",
  authenticateUser,
  isSuperAdminAuthorized,
  deleteCompany
);
export default router;
